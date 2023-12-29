<template>
  <v-card flat class="mt-2">
    <v-card-title class="d-flex align-center">
      <p>History</p>
      <v-spacer></v-spacer>
      <v-select
        density="compact"
        :items="quickFilters"
        label="Quick filters"
        variant="outlined"
        clearable
        :single-line="true"
        @click:clear="fiterWithQuickFilters($event)"
        @update:modelValue="fiterWithQuickFilters($event)"
      >
      </v-select>
      <v-dialog width="auto">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" text="Filter by Date"> </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
          <v-card>
            <v-date-picker
              @update:modelValue="
                filterDatePicker($event), (isActive.value = false)
              "
              :max="new Date()"
            ></v-date-picker>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                text="Close Dialog"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn
        v-if="isFilteredByDate"
        @click="
          (dateToFilter = null),
            (isFilteredByDate = false),
            (isAscending = false),
            getHistory(`?start=0&nb=${itemsPerPage}&isASc=${isAscending}`)
        "
        >Delete filter</v-btn
      >
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table-server
      density="comfortable"
      :hover="true"
      fixed-header
      :headers="headers"
      :items="this.historyResultsFormatted"
      :items-per-page="itemsPerPage"
      :items-length="totalItems"
      :loading="isHistoryLoading"
      @update:options="sortPagination($event)"
    >
    </v-data-table-server>
  </v-card>
</template>
<script>
import * as HistoryService from "../services/HistoryService.js";
export default {
  data() {
    return {
      history: {},
      historyResults: [],
      historyResultsFormatted: [],
      itemsPerPage: 25,
      totalItems: 0,
      isHistoryLoading: true,
      dateToFilter: null,
      isFilteredByDate: false,
      dateStartFilter: null,
      dateEndFilter: null,
      isAscending: false,
      quickFilters: ["Today", "Yesterday", "Last week"],
      headers: [
        {
          title: "Date",
          key: "startWatchDateFormatted",
          sortable: false,
        },
        {
          title: "User",
          key: "userName",
          sortable: false,
        },
        {
          title: "Ip",
          key: "ip",
          sortable: false,
        },
        {
          title: "Player",
          key: "deviceName",
          sortable: false,
        },
        {
          title: "Device",
          key: "deviceAppName",
          sortable: false,
        },
        {
          title: "Media title",
          key: "title",
          sortable: false,
        },
        {
          title: "Started time",
          key: "startWatchTimeFormatted",
          sortable: false,
        },
        {
          title: "Paused duration",
          key: "pauseDurationFormatted",
          sortable: false,
        },
        {
          title: "Watched duration",
          key: "watchedDurationFormatted",
          sortable: false,
        },
        {
          title: "Stopped time",
          key: "stoppedTimeFormatted",
          sortable: false,
        },
      ],
    };
  },
  mounted() {},
  methods: {
    async getHistory(params) {
      this.isHistoryLoading = true;
      this.historyResults = [];
      this.historyResultsFormatted = [];

      try {
        this.history = await HistoryService.get(params);
        this.totalItems = this.history.count;
        this.history.results.forEach((item) => {
          this.historyResults.push(item);
          this.historyResultsFormatted.push(this.formatHistoryResult(item));
        });
        this.isHistoryLoading = false;
      } catch (e) {
        console.log(e);
        this.isHistoryLoading = false;
      }
    },

    formatHistoryResult(item) {
      // Date format
      let startWatchWithoutTime = item.startWatch.split("T")[0],
        startWatchWithoutTimeSplitted = startWatchWithoutTime.split("-"),
        aaaa = startWatchWithoutTimeSplitted[0],
        mm = startWatchWithoutTimeSplitted[1],
        dd = startWatchWithoutTimeSplitted[2];

      item.startWatchDateFormatted = `${dd}/${mm}/${aaaa}`;

      // Time start format
      let startWatchWithoutDate = item.startWatch.split("T")[1],
        startWatchWhithoutMS = startWatchWithoutDate.split(".")[0];
      item.startWatchTimeFormatted = startWatchWhithoutMS;

      // Pause duration format
      let pauseDurationWithoutMS = item.pauseDuration.split(".")[0];
      item.pauseDurationFormatted = pauseDurationWithoutMS;

      // Watched duration format
      let totalDurationWithoutMS = item.fileRuntime.split(".")[0],
        totalDurationInSecond = this.getTimeInSeconds(totalDurationWithoutMS),
        remainingTimeWithoutMS = item.remaningTime.split(".")[0],
        remainingTimeInSecond = this.getTimeInSeconds(remainingTimeWithoutMS),
        seconds = totalDurationInSecond - remainingTimeInSecond;

      const dateWatchDuration = new Date(null);
      dateWatchDuration.setSeconds(seconds);
      const watchedDurationFormatted = dateWatchDuration
        .toISOString()
        .slice(11, 19);
      item.watchedDurationFormatted = watchedDurationFormatted;

      // Stopped time format
      let startTimeInSeconds = this.getTimeInSeconds(startWatchWhithoutMS),
        pauseDurationInSeconds = this.getTimeInSeconds(pauseDurationWithoutMS),
        watchedDurationInSeconds = this.getTimeInSeconds(
          watchedDurationFormatted
        );

      const dateStoppedTime = new Date(null);
      dateStoppedTime.setSeconds(
        startTimeInSeconds + pauseDurationInSeconds + watchedDurationInSeconds
      );
      const stoppedTimeFormatted = dateStoppedTime.toISOString().slice(11, 19);
      item.stoppedTimeFormatted = stoppedTimeFormatted;

      return item;
    },

    sortPagination(event) {
      let page = event.page;
      let itemsPerPage = event.itemsPerPage;

      if (this.dateToFilter !== null) {
        this.getHistory(
          `?start=${(page - 1) * itemsPerPage}&nb=${itemsPerPage}&dateStart=${
            this.dateToFilter
          }&isASc=${this.isAscending}`
        );
      } else if (this.dateEndFilter !== null && this.dateStartFilter !== null) {
        this.getHistory(
          `?start=${(page - 1) * itemsPerPage}&nb=${itemsPerPage}&dateStart=${
            this.dateStartFilter
          }&dateEnd=${this.dateEndFilter}`
        );
      } else {
        this.getHistory(
          `?start=${(page - 1) * itemsPerPage}&nb=${itemsPerPage}`
        );
      }
    },

    filterDatePicker(event) {
      let dateToFilter = event.toISOString().split("T")[0];
      this.dateToFilter = dateToFilter;
      let itemsPerPage = this.itemsPerPage;
      this.isAscending = true;
      let isAscending = this.isAscending;
      this.getHistory(
        `?start=0&nb=${itemsPerPage}&dateStart=${dateToFilter}&isASc=${isAscending}`
      );
      this.isFilteredByDate = true;
    },

    fiterWithQuickFilters(event) {
      if (event !== null) {
        console.log(event);
        if (typeof event == "string") {
          let dateStart = null;
          let dateEnd = null;
          if (event == "Today") {
            dateStart = new Date().toISOString().split("T")[0];
            dateEnd = ((d) => new Date(d.setDate(d.getDate() + 1)))(new Date())
              .toISOString()
              .split("T")[0];
          } else if (event == "Yesterday") {
            dateStart = ((d) => new Date(d.setDate(d.getDate() - 1)))(
              new Date()
            )
              .toISOString()
              .split("T")[0];
            dateEnd = new Date().toISOString().split("T")[0];
          } else if (event == "Last week") {
            dateStart = ((d) => new Date(d.setDate(d.getDate() - 14)))(
              new Date()
            )
              .toISOString()
              .split("T")[0];
            dateEnd = ((d) => new Date(d.setDate(d.getDate() - 7)))(new Date())
              .toISOString()
              .split("T")[0];
          }

          if (dateStart !== null && dateEnd !== null) {
            this.dateStartFilter = dateStart;
            this.dateEndFilter = dateEnd;
            this.getHistory(
              `?start=0&nb=${this.itemsPerPage}&dateStart=${dateStart}&dateEnd=${dateEnd}`
            );
          }
        } else if (typeof event == "object") {
        }
      }
    },

    getTimeInSeconds(time) {
      let hh = parseInt(time.split(":")[0]),
        mm = parseInt(time.split(":")[1]),
        ss = parseInt(time.split(":")[2]);

      return hh * 3600 + mm * 60 + ss;
    },
  },
};
</script>

<style lang="scss">
.v-card {
  &-title {
    .v-input {
      &__details {
        display: none;
      }
    }
  }
  .v-table {
    height: calc(100vh - 128px);
    &__wrapper {
      .v-data-table__thead {
        box-shadow: #0000004f 0px 3px 3px 1px;
      }
    }
    .v-data-table-footer {
      justify-content: space-between;
    }
  }
}
</style>

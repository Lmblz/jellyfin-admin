<template>
  <v-card flat class="mt-2">
    <v-card-title class="d-flex align-center">
      <p>History</p>
      <v-spacer></v-spacer>
      <v-text-field
        v-if="context !== 'userView'"
        clearable
        label="Search by User Id"
        variant="outlined"
        density="compact"
        v-model="userToFilter"
        @update:modelValue="filterWithUserId($event)"
        @click:clear="getHistory()"
      ></v-text-field>
      <v-select
        class="mx-2"
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
        v-if="showDeleteFiltersButton"
        @click="
          (dateToFilter = null),
            (showDeleteFiltersButton = false),
            (isAscending = false),
            (dateStartFilter = null),
            (dateEndFilter = null),
            (userToFilter = null)
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
      :items-per-page-options="itemsPerPageOptions"
      :items-length="totalItems"
      :loading="isHistoryLoading"
      :class="context"
      @update:options="sortPagination($event)"
      :no-data-text="noDataText"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.title="{ item }">
        <router-link
          :to="'/Media/' + item.id"
          style="color: inherit; text-decoration: inherit"
        >
          <p>
            {{ item.title }}
            <slot v-if="item.mediaType == 'tv'"
              >- S{{ item.saison }} - E{{ item.episode }}</slot
            >
          </p>
        </router-link>
      </template>

      <!-- eslint-disable-next-line -->
      <template v-slot:item.userName="{ item }">
        <component
          :is="userNameNode"
          v-bind="linkProps(item)"
          class="d-flex align-center history-user"
        >
          <v-avatar
            :color="item.userHasPicture ? '' : 'primary'"
            size="small"
            class="user-avatar__image"
            :class="item.userHasPicture ? '-has-picture' : ''"
          >
            <slot v-if="item.userHasPicture">
              <v-img
                :src="
                  'https://j.nimi.ovh/users/' + item.userId + '/Images/Primary'
                "
              />
            </slot>
            <b v-else>
              {{ item.userName.split("")[0].toUpperCase() }}
            </b>
          </v-avatar>
          <p class="ml-2">{{ item.userName }}</p>
        </component>
      </template>

      <template v-slot:item.percentageWatched="{ item }">
        <v-row>
          <p
            class="percentage-watched mr-2"
            :style="{ '--progression': item.percentageWatched }"
          ></p>
          <p>{{ item.percentageWatched }}%</p>
        </v-row>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
// TODO : filter user & media
// Throws well to many results, why ?
import * as HistoryService from "../services/HistoryService.js";
export default {
  data() {
    return {
      history: {},
      historyResults: [],
      historyResultsFormatted: [],
      currentPage: 0,
      itemsPerPage: 25,
      itemsPerPageOptions: [10, 25, 50, 100],
      totalItems: 0,
      isHistoryLoading: true,
      dateToFilter: null,
      showDeleteFiltersButton: false,
      dateStartFilter: null,
      dateEndFilter: null,
      isAscending: false,
      userToFilter: null,
      noDataText: "",
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
          title: "Paused",
          key: "pauseDurationFormatted",
          sortable: false,
        },
        {
          title: "Duration",
          key: "watchedDurationFormatted",
          sortable: false,
        },
        {
          title: "Stopped time",
          key: "stoppedTimeFormatted",
          sortable: false,
        },
        {
          title: "Percentage watched",
          key: "percentageWatched",
          sortable: false,
        },
      ],
    };
  },

  props: {
    userId: {
      type: String,
    },
    context: {
      type: String,
    },
    defaultFilter: {
      type: Array,
    },
    nbResults: {
      type: Number,
    },
    noData: {
      type: String,
      required: true,
    },
  },

  created() {},

  mounted() {
    if (this.$props.nbResults !== undefined) {
      this.itemsPerPage = this.$props.nbResults;
    }

    if (this.$props.noData) {
      this.noDataText = this.$props.noData;
    }
  },

  computed: {
    userNameNode() {
      return this.context !== "userView" ? "router-link" : "div";
    },
  },

  methods: {
    linkProps(item) {
      if (this.context !== "userView") {
        return {
          to: `/users/${item.userId}`,
        };
      } else {
        return {};
      }
    },

    async getHistory() {
      this.isHistoryLoading = true;
      let params = [];
      const defaultFilter = this.$props.defaultFilter;

      // Default filters based on context
      if (defaultFilter !== undefined) {
        defaultFilter.forEach((filter, index) => {
          params.push({ param: filter.param, value: filter.value });
        });
      }

      // Number of results
      if (this.itemsPerPage > 0) {
        params.push({ param: "nb", value: this.itemsPerPage });
      }

      // Start
      if (this.currentPage > 0) {
        params.push({
          param: "start",
          value: (this.currentPage - 1) * this.itemsPerPage,
        });
      }

      // Date start
      if (this.dateStartFilter !== null) {
        //console.log(this.dateStartFilter);
        params.push({
          param: "dateStart",
          value: this.dateStartFilter,
        });
      }

      // Date end
      if (this.dateEndFilter !== null) {
        //console.log(this.dateEndFilter);
        params.push({
          param: "dateEnd",
          value: this.dateEndFilter,
        });
      }

      // User
      if (this.userToFilter !== null) {
        params.push({
          param: "userId",
          value: this.userToFilter,
        });
      }

      let paramsString = "";
      if (params.length > 0) {
        paramsString += "?";
        params.forEach((param, index) => {
          let newParam = "";
          if (index !== 0) newParam += "&";
          newParam += param.param + "=" + param.value;
          paramsString += newParam;
        });
      }

      try {
        this.history = await HistoryService.get(paramsString);
        this.totalItems = this.history.count;
        for (let i = 0; i < this.history.results.length; i++) {
          if (i == 0) {
            this.historyResults = [];
            this.historyResultsFormatted = [];
          }

          const item = this.history.results[i];
          this.historyResults.push(item);
          this.historyResultsFormatted.push(this.formatHistoryResult(item));
        }
        this.isHistoryLoading = false;
      } catch (e) {
        console.error(e);
        this.$emit("errorEvent", { context: "History", message: e.message });
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
      const startWatchWithoutDate = item.startWatch.split("T")[1],
        startWatchWhithoutMS = startWatchWithoutDate.split(".")[0],
        startWatchWithoutMSSplitted = startWatchWhithoutMS.split(":"),
        startWatchInSec =
          startWatchWithoutMSSplitted[0] + "h" + startWatchWithoutMSSplitted[1];
      item.startWatchTimeFormatted = startWatchInSec;

      // Pause duration format
      let pauseDurationWithoutMS = item.pauseDuration.split(".")[0],
        splittedPauseDuration = pauseDurationWithoutMS.split(":"),
        pauseDurationInMin =
          parseInt(splittedPauseDuration[0]) * 60 +
          parseInt(splittedPauseDuration[1]);
      pauseDurationInMin == 0
        ? (pauseDurationInMin = "/")
        : (pauseDurationInMin = pauseDurationInMin + "m");
      item.pauseDurationFormatted = pauseDurationInMin;

      // Watched duration format
      const totalDurationWithoutMS = item.fileRuntime.split(".")[0],
        totalDurationInSecond = this.getTimeInSeconds(totalDurationWithoutMS),
        remainingTimeWithoutMS = item.remaningTime.split(".")[0],
        remainingTimeInSecond = this.getTimeInSeconds(remainingTimeWithoutMS),
        watchTimeInSecond = totalDurationInSecond - remainingTimeInSecond;

      const watchDurationInMin = Math.floor(watchTimeInSecond / 60);
      let watchDurationFormatted;
      if (watchDurationInMin >= 60) {
        watchDurationFormatted =
          Math.floor(watchDurationInMin / 60) +
          "h " +
          (watchDurationInMin % 60) +
          "m";
      } else {
        watchDurationFormatted = watchDurationInMin + "m";
      }
      item.watchedDurationFormatted = watchDurationFormatted;

      // Percentage watched
      let percentageWatched = Math.round(
        (watchTimeInSecond / totalDurationInSecond) * 100
      );
      if (percentageWatched >= 95) percentageWatched = 100;
      item.percentageWatched = percentageWatched;

      // Stopped time format
      const endTimeDate = new Date(item.endWatch);
      let stoppedTimeHours = endTimeDate.getHours(),
        stoppedTimeMinutes = endTimeDate.getMinutes();

      if (stoppedTimeHours < 10) {
        stoppedTimeHours = "0" + stoppedTimeHours;
      }

      if (stoppedTimeMinutes < 10) {
        stoppedTimeMinutes = "0" + stoppedTimeMinutes;
      }

      const stoppedTimeFormattedWithoutSec =
        stoppedTimeHours + "h" + stoppedTimeMinutes;
      item.stoppedTimeFormatted = stoppedTimeFormattedWithoutSec;

      return item;
    },

    sortPagination(event) {
      this.currentPage = event.page;
      this.getHistory();
    },

    filterDatePicker(event) {
      let dateStartFilter = new Date(event.setDate(event.getDate() + 1))
        .toISOString()
        .split("T")[0];

      let dateEndFilter = new Date(event.setDate(event.getDate() + 1))
        .toISOString()
        .split("T")[0];
      this.dateStartFilter = dateStartFilter;
      this.dateEndFilter = dateEndFilter;
      this.isAscending = true;

      this.getHistory();
      this.showDeleteFiltersButton = true;
    },

    fiterWithQuickFilters(event) {
      if (event !== null) {
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
            this.showDeleteFiltersButton = true;
            this.dateStartFilter = dateStart;
            this.dateEndFilter = dateEnd;

            this.getHistory();
          }
        }
      }
    },

    filterWithUserId(event) {
      if (event !== null) {
        this.userToFilter = event;
        this.getHistory();
        this.showDeleteFiltersButton = true;
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
    &.userView {
      max-height: calc(100vh - 320px);
    }

    max-height: calc(100vh - 140px);

    &__wrapper {
      .v-data-table__thead {
        box-shadow: #0000004f 0px 3px 3px 1px;
      }

      .v-data-table__tr {
        &:nth-child(odd) {
          .v-data-table__td {
            border-bottom: thin solid #ffffff66 !important;
          }
        }

        &:nth-child(even) {
          .v-data-table__td {
            border-bottom: thin solid #ffffffaa !important;
          }
        }

        .percentage-watched {
          border: thin solid white;
          border-radius: 9999px;
          height: 20px;
          width: 20px;
          position: relative;

          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: conic-gradient(
              white calc(var(--progression) * 1%),
              #333 0
            );
            border-radius: inherit;
          }
        }
      }
    }

    .v-data-table-footer {
      justify-content: space-between;
    }

    .history-user {
      text-decoration: none;
      color: inherit;
    }
  }
}
</style>

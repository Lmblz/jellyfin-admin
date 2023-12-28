<template>
  <v-card flat class="mt-2">
    <v-card-title class="d-flex align-center">
      <p>History</p>
      <v-spacer></v-spacer>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table-server
      density="comfortable"
      hover="true"
      fixed-header
      :headers="headers"
      :items="this.historyResultsFormatted"
      :items-per-page="itemsPerPage"
      :search="search"
      :items-length="totalItems"
      :loading="isHistoryLoading"
      @update:options="
        getHistory(`?nb=${this.itemsPerPage}&start=${startItem}`, $event)
      "
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
      search: "",
      isHistoryLoading: true,
      startItem: 0,
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
  mounted() {
    //this.getHistory(`?nb=${this.itemsPerPage}&start=0`);
  },
  methods: {
    async getHistory(params, event) {
      this.isHistoryLoading = true;
      this.historyResults = [];
      this.historyResultsFormatted = [];
      try {
        this.history = await HistoryService.get(
          `?nb=${event.itemsPerPage}&start=${
            event.page * event.itemsPerPage - event.itemsPerPage
          }`
        );
        this.totalItems = this.history.count;
        this.history.results.forEach((item) => {
          this.historyResults.push(item);
          this.historyResultsFormatted.push(this.formatHistoryResult(item));
        });
        this.isHistoryLoading = false;
        this.startItem += 25;
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

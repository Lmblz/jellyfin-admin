<template>
  <!-- <div>
    <h1>coucou</h1>
    <p>Nb de résultats : {{ history.count }}</p>
    <p>Nb de résultats affiché : {{ history.nb }}</p>
    <p v-for="result in history.results" :key="result.id">
      Item : {{ result }}
    </p>
  </div> -->
  <v-data-table
    :headers="headers"
    :items="this.historyResultsFormatted"
    :items-per-page="itemsPerPage"
    :search="search"
  >
    <template v-slot:top>
      <!-- <v-text-field
        :model-value="itemsPerPage"
        class="pa-2"
        hide-details
        label="Items per page"
        min="1"
        max="100"
        type="number"
        @update:model-value="itemsPerPage = parseInt($event, 10)"
      ></v-text-field> -->
    </template>
  </v-data-table>
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
      search: "",
      headers: [
        {
          title: "Date",
          key: "startWatchDateFormatted",
        },
        {
          title: "User",
          key: "userName",
        },
        {
          title: "Ip",
          key: "ip",
        },
        {
          title: "Player",
          key: "deviceName",
        },
        {
          title: "Device",
          key: "deviceAppName",
        },
        {
          title: "Media title",
          key: "title",
        },
        {
          title: "Started time",
          key: "startWatchTimeFormatted",
        },
        {
          title: "Paused duration",
          key: "pauseDurationFormatted",
        },
        {
          title: "Watched duration",
          key: "watchedDurationFormatted",
        },
        {
          title: "Stopped time",
          key: "stoppedTimeFormatted",
        },
      ],
    };
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    async getHistory() {
      try {
        this.history = await HistoryService.getAll("?nb=50&start=0");
        this.history.results.forEach((item) => {
          this.historyResults.push(item);
          this.historyResultsFormatted.push(this.formatHistoryResult(item));
        });
      } catch (e) {
        console.log(e);
      }
      console.log(this.history);
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
<style lang=""></style>

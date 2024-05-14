<template>
  <div>
    <user-card
      :userData="userData"
      context="userView"
      class="mt-2"
      v-if="userData"
    ></user-card>
  </div>

  <history-table
    v-if="userData && userData.totalWatch > 0"
    :userId="userId"
    context="userView"
    :default-filter="[{ param: 'userId', value: userId }]"
    no-data="It seems empty here :/"
  ></history-table>
</template>

<script>
import * as UsersService from "../services/UsersService";
import * as HistoryService from "../services/HistoryService";
import UserCard from "../components/UserCard.vue";
import HistoryTable from "@/components/HistoryTable.vue";

export default {
  data() {
    return {
      userId: null,
      userData: null,
      historyData: null,
      userHistory: [],
      userHistoryFormatted: [],
      itemsPerPage: 25,
      itemsPerPageOptions: [10, 25, 50, 100],
      isHistoryLoading: true,
      totalItems: 0,
      headers: [
        {
          title: "Date",
          key: "startWatchDateFormatted",
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
      ],
    };
  },

  components: {
    UserCard,
    HistoryTable,
  },

  created() {
    this.userId = this.$route.params.id;
    this.getUser();
    //this.getUserHistory();
  },

  methods: {
    async getUser() {
      try {
        this.userData = await UsersService.get(`?userId=${this.userId}`);
        this.userData = this.userData.results[0];
        this.totalItems = this.userData.totalWatch;
        console.log(this.userData);
      } catch (e) {
        console.error(e);
      }
    },

    async getUserHistory() {
      this.isHistoryLoading = true;
      try {
        this.historyData = await HistoryService.get(
          "?userId=" + this.userId + "&nb=" + this.itemsPerPage
        );
        this.historyData.results.forEach((item) => {
          this.userHistory.push(item);
          this.userHistoryFormatted.push(this.formatHistoryResult(item));
        });
        this.userHistory = this.historyData.results;
        console.log(this.userHistory);
      } catch (e) {
        console.error(e);
      }
      this.isHistoryLoading = false;
    },

    formatDate(date) {
      if (date !== "0001-01-01T00:00:00" && date != undefined && date != "") {
        let dateWithoutSec = date.substring(0, date.length - 11);
        let splittedDate = dateWithoutSec.split("T");
        let dateArr = splittedDate[0].split("-");
        return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]} ${splittedDate[1]}`;
      }

      return "Never";
    },

    formatHistoryResult(item) {
      console.log(item);
      item.startWatchDateFormatted = this.formatDate(item.startWatch);

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
    },

    getTimeInSeconds(time) {
      let hh = parseInt(time.split(":")[0]),
        mm = parseInt(time.split(":")[1]),
        ss = parseInt(time.split(":")[2]);

      return hh * 3600 + mm * 60 + ss;
    },

    sortPagination(event) {
      let page = event.page;
      let itemsPerPage = event.itemsPerPage;
      //   if (this.dateToFilter !== null) {
      //     this.getHistory(
      //       `?start=${(page - 1) * itemsPerPage}&nb=${itemsPerPage}&dateStart=${
      //         this.dateToFilter
      //       }&isASc=${this.isAscending}${
      //         this.userToFilter !== null && this.userToFilter !== ""
      //           ? "&userId=" + this.userToFilter
      //           : ""
      //       }`
      //     );
      //   } else if (this.dateEndFilter !== null && this.dateStartFilter !== null) {
      //     this.getHistory(
      //       `?start=${(page - 1) * itemsPerPage}&nb=${itemsPerPage}&dateStart=${
      //         this.dateStartFilter
      //       }&dateEnd=${this.dateEndFilter}${
      //         this.userToFilter !== null && this.userToFilter !== ""
      //           ? "&userId=" + this.userToFilter
      //           : ""
      //       }`
      //     );
      //   } else {
      //     this.getHistory(
      //       `?start=${(page - 1) * itemsPerPage}&nb=${itemsPerPage}${
      //         this.userToFilter !== null && this.userToFilter !== ""
      //           ? "&userId=" + this.userToFilter
      //           : ""
      //       }`
      //     );
      //   }
    },
  },
};
</script>

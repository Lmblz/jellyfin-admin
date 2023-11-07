<template>
  <v-card
    elevation="12"
    rounded="lg"
    width="100%"
    height="100%"
    variant="tonal"
    class="d-flex flex-column"
    :style="{ background: media.posterColor }"
  >
    <v-row class="pa-2 pb-0 ma-0">
      <v-col cols="4" class="pa-0 h-100 d-flex align-center">
        <v-img :src="getMediaPoster" class="rounded"></v-img>
      </v-col>
      <v-col cols="8" justify-self="end" class="pt-0 list-params">
        <v-list class="bg-transparent pa-0">
          <v-list-item
            v-for="element in listElementsInCard"
            :key="element"
            class="pa-0"
            min-height="0"
          >
            <p class="text-caption">
              {{ element.title }} : {{ element.content }}
            </p>
          </v-list-item>
        </v-list>
        <div class="player-image rounded">
          <v-img :src="getPlayerImage" width="50">
            <v-tooltip activator="parent" location="end">{{
              device.name
            }}</v-tooltip></v-img
          >
        </div>
      </v-col>
    </v-row>
    <v-row class="ma-0 px-2">
      <p class="text-caption" style="font-size: 0.625rem !important">
        {{ media.file.name }}
      </p>
    </v-row>
    <v-card-actions class="pa-2 pt-3 w-100 flex-wrap bg-background">
      <div
        class="progress-bar bg-primary"
        :style="{ width: media.percentWatch + '%' }"
      ></div>
      <v-row class="ma-0 align-center">
        <v-row class="ma-0 align-center">
          <div>
            <v-icon
              :icon="media.pause.isPaused ? 'mdi-pause' : 'mdi-play'"
              size="x-small"
              class="mr-1"
            ></v-icon>
            <v-tooltip activator="parent" location="end">{{
              media.pause.isPaused ? getPauseDuration : "En cours de lecture"
            }}</v-tooltip>
          </div>
          <p class="text-caption mr-2">{{ media.title }}</p>
          <slot v-if="media.type == 'tv'">
            <p class="text-caption mr-2">
              E{{ media.episode }} - S{{ media.saison }}
            </p>
          </slot>
        </v-row>
        <v-row class="ma-0">
          <p class="text-caption">
            {{ getTimePlayed }} /
            {{
              getTotalDuration.hh +
              ":" +
              getTotalDuration.mm +
              ":" +
              getTotalDuration.ss
            }}
          </p>
          <div class="user-avatar__wrapper d-flex flex-column align-center">
            <v-avatar color="primary" size="small" class="user-avatar__image"
              ><b>{{ user.name.split("")[0].toUpperCase() }} </b></v-avatar
            >
            <p class="text-caption">{{ user.name }}</p>
          </div>
        </v-row>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isMovieLoading: true,
      posterBaseUrl: "https://image.tmdb.org/t/p/original/",
      movie: {},
      oldMovieId: "",
      listElementsInCard: [
        {
          title: "Ip",
          content: this.$props.user.ip,
        },
        {
          title: "Play method",
          content: this.$props.media.playMethod,
        },
        {
          title: "Librairie",
          content: this.$props.media.file.library,
        },
        {
          title: "App",
          content: this.$props.device.appName,
        },
        {
          title: "App version",
          content: this.$props.device.appVersion,
        },
        {
          title: "Codec",
          content: this.$props.media.file.codec,
        },
        {
          title: "Début de lecture",
          content: this.formatTime(this.$props.media.startWatch),
        },
      ],
    };
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
    device: {
      type: Object,
      required: true,
    },
    media: {
      type: Object,
      required: true,
    },
  },

  mounted() {},

  watch: {},

  created() {},

  computed: {
    getMediaPoster() {
      return `https://j.nimi.ovh/Items/${this.$props.media.posterId}/Images/Primary`;
    },
    getPauseDuration() {
      let time = this.$props.media.pause.pauseDuration;
      let timeFormatted = this.getHhMmSs(time);

      timeFormatted.ss.split("")[0] == "0"
        ? (timeFormatted.ss = timeFormatted.ss.split("")[1])
        : "";

      if (timeFormatted.hh !== "00") {
        return `Durée de la pause : ${timeFormatted.hh} heure${
          timeFormatted.hh > 1 ? "s" : ""
        }, ${timeFormatted.mm} minutes et ${timeFormatted.ss} secondes`;
      } else {
        return `Durée de la pause : ${timeFormatted.mm} minutes et ${timeFormatted.ss} secondes`;
      }
    },
    getTotalDuration() {
      let totalTime = this.$props.media.file.runtime;
      let totalTimeFormatted = this.getHhMmSs(totalTime);
      return totalTimeFormatted;
    },
    getTimePlayed() {
      let remaningTime = this.$props.media.remaningTime;
      let remaningTimeFormatted = this.getHhMmSs(remaningTime);
      let remaningTimeInSecond = this.convertTimeToSeconds(
        remaningTimeFormatted.hh,
        remaningTimeFormatted.mm,
        remaningTimeFormatted.ss
      );

      let totalTimeInSecond = this.convertTimeToSeconds(
        this.getTotalDuration.hh,
        this.getTotalDuration.mm,
        this.getTotalDuration.ss
      );

      let timeDifference = totalTimeInSecond - remaningTimeInSecond;

      return new Date(timeDifference * 1000).toISOString().slice(11, 19);
    },
    getPlayerImage() {
      let player = this.$props.device.name;
      player == "iPad" ? (player = "iPhone") : "";
      let extension = ".png";
      let playerImagePath = "/Player-logos/" + player + extension;
      return playerImagePath;
    },
  },

  methods: {
    getHhMmSs(time) {
      let dataArray = time.split(":");
      let hh = dataArray[0];
      let mm = dataArray[1];
      let ss = dataArray[2].split(".")[0];
      return { hh, mm, ss };
    },
    getDdMmAaaa(date) {
      let dataArray = date.split("-");
      let dd = dataArray[2];
      let mm = dataArray[1];
      let aaaa = dataArray[0];
      return { dd, mm, aaaa };
    },
    convertTimeToSeconds(hh, mm, ss) {
      return parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss);
    },
    formatTime(timestamp) {
      let timestampSplitted = timestamp.split("T");
      let days = timestampSplitted[0];
      let time = timestampSplitted[1];

      let daysFormatted = this.getDdMmAaaa(days);
      let timeFormatted = this.getHhMmSs(time);

      return `${daysFormatted.dd}/${daysFormatted.mm}/${daysFormatted.aaaa} à ${timeFormatted.hh}h${timeFormatted.mm}`;
    },
    doesImageExist(url) {
      let http = new XMLHttpRequest();
      http.send("HEAD", url, false);
      http.send();
      return http.status !== 404;
    },
  },
};
</script>

<style lang="scss">
.v-list-item--density-default {
  min-height: inherit;
}
.v-card {
  & > .v-row {
    background: linear-gradient(90deg, #121212ff, #12121200) !important;
    position: relative;

    & > .v-col {
      &.list-params {
        position: relative;

        .player-image {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
  &-actions {
    position: relative;
    box-shadow: inset #0000009c 0px 6px 5px -2px;

    .progress-bar {
      width: 100%;
      height: 2px;
      transition: width 5s;
      position: absolute;
      top: 0;
      left: 0;
    }
    & > .v-row {
      width: 100%;
      position: relative;

      & > .v-row {
        width: 100%;

        .user-avatar__wrapper {
          position: absolute;
          right: 0;
          top: -2px;

          p {
            font-size: 0.625rem !important;
          }
        }
      }
    }

    .v-avatar {
      & > * {
        cursor: default;
      }
    }
  }
}
</style>

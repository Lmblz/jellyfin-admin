<template>
  <v-card
    elevation="12"
    rounded="lg"
    width="100%"
    height="100%"
    variant="tonal"
    class="d-flex flex-column bg-surface"
  >
    <v-row class="pa-2 ma-0">
      <v-col cols="4" class="pa-0 h-100 d-flex align-center">
        <v-img :src="getMediaPoster" class="rounded"></v-img>
      </v-col>
      <v-col cols="8" justify-self="end" class="pt-0">
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
        <div
          class="player-image rounded pa-1"
          :style="{ background: getPlayerColor }"
        >
          <v-img :src="getPlayerImage" width="32"></v-img>
        </div>
      </v-col>
    </v-row>
    <v-card-actions class="pa-2 pt-3 w-100 flex-wrap bg-background">
      <div
        class="progress-bar bg-primary"
        :style="{ width: media.percentWatch + '%' }"
      ></div>
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
        <p>{{ media.title }}</p>
        <v-spacer></v-spacer>
        <slot v-if="media.type == 'tv'">
          <p class="text-caption mr-2">
            E{{ media.episode }} - S{{ media.saison }}
          </p>
        </slot>
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
        <v-spacer></v-spacer>
        <v-avatar
          color="primary"
          size="small"
          class="user-avatar"
          :title="user.name"
          ><b>{{ user.name.split("")[0].toUpperCase() }} </b>
          <v-tooltip activator="parent" location="end">{{
            user.name
          }}</v-tooltip></v-avatar
        >
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
          title: "Player",
          content: this.$props.device.name,
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
          title: "Nom du fichier",
          content: this.$props.media.file.name,
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

  mounted() {
    console.log(this.$props);
  },

  watch: {},

  created() {
    console.log(this.$props);
  },

  computed: {
    getMediaPoster() {
      return `https://j.nimi.ovh/Items/${this.$props.media.posterId}/Images/Primary`;
    },
    getPauseDuration() {
      let time = this.$props.media.pause.pauseDuration;
      let timeFormatted = this.getHhMmSs(time);
      console.log(timeFormatted);

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
      let extension = ".svg";
      if (player == "Safari") {
        extension = ".png";
      }
      let playerImagePath = "/Player-logos/" + player + extension;
      return playerImagePath;
    },
    getPlayerColor() {
      // get browser svg https://github.com/alrra/browser-logos
      let player = this.$props.device.name;
      switch (player) {
        case "Chrome":
          return "#536b94";
        case "Safari":
          return "#CA3437";
        case "Firefox":
          return "#6A54BB";
        default:
          return "#FFFFFF";
      }
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
    convertTimeToSeconds(hh, mm, ss) {
      return parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss);
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
      position: relative;
      .player-image {
        position: absolute;
        top: 0;
        right: 0;
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
    }

    .v-avatar {
      & > * {
        cursor: default;
      }
    }
  }
}
</style>

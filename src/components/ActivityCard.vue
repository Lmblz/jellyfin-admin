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
      <v-col cols="4" class="pa-0 h-100 d-flex align-center movie-image">
        <v-img :src="getMediaPoster" class="rounded h-100" cover></v-img>
      </v-col>
      <v-col
        cols="8"
        justify-self="end"
        class="pt-0 list-params d-flex align-center"
      >
        <v-list class="bg-transparent pa-0">
          <v-list-item
            v-for="element in listElementsInCard"
            :key="element"
            class="pa-0 mb-2"
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
              device.appName
            }}</v-tooltip></v-img
          >
        </div>
      </v-col>
    </v-row>
    <v-row class="ma-0 px-2">
      <p
        class="text-caption file-name"
        ref="fileName"
        style="font-size: 0.625rem !important"
      >
        {{ media.file.name }}
        <v-tooltip
          v-if="isFileNameOverflown"
          activator="parent"
          location="end"
          >{{ media.file.name }}</v-tooltip
        >
      </p>
    </v-row>
    <v-card-actions class="pa-2 pt-3 w-100 flex-wrap bg-background">
      <div
        class="progress-bar bg-primary"
        :style="{ width: media.percentWatch + '%' }"
      ></div>
      <v-row class="ma-0 align-center">
        <v-row class="ma-0 align-center">
          <div ref="playState">
            <v-icon
              :icon="media.pause.isPaused ? 'mdi-pause' : 'mdi-play'"
              size="x-small"
              class="mr-1 playing-state"
              :id="'sessionActivator-' + $props.activityId"
            ></v-icon>
            <v-tooltip activator="parent" location="end">{{
              media.pause.isPaused ? getPauseDuration : "Currently playing"
            }}</v-tooltip>
            <v-menu
              transition="slide-y-transition"
              :activator="'#sessionActivator-' + $props.activityId"
            >
              <v-list>
                <v-list-item
                  v-for="(service, index) in getListSessionServices"
                  :key="index"
                  @click="service.value"
                >
                  <v-list-item-title class="d-flex align-center"
                    ><v-icon
                      :icon="service.icon"
                      size="x-small"
                      class="mr-2"
                      :style="{
                        fontSize: service.fontSize + 'px',
                        width: '16px',
                      }"
                      width="16"
                    ></v-icon
                    >{{ service.title }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <p class="text-caption mr-2 media-title" ref="mediaTitle">
            <router-link
              :to="'/media/' + media.id"
              style="color: inherit; text-decoration: inherit"
            >
              <v-tooltip
                v-if="isMediaTitleOverflown"
                activator="parent"
                location="end"
                >{{ media.title }}</v-tooltip
              >
              {{ media.title }}
            </router-link>
          </p>
          <slot v-if="media.type == 'tv'">
            <p class="text-caption mr-2 show-episode" ref="showEpisode">
              S{{ media.saison }} - E{{ media.episode }}
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
            <router-link :to="`/users/${user.id}`" class="user-avatar__link">
              <v-avatar
                color="primary"
                size="small"
                class="user-avatar__image"
                :class="user.hasPicture ? '-has-picture' : ''"
              >
                <slot v-if="user.hasPicture">
                  <img
                    :src="
                      'https://j.nimi.ovh/users/' + user.id + '/Images/Primary'
                    "
                  />
                </slot>
                <b v-else>
                  {{ user.name.split("")[0].toUpperCase() }}
                </b>
              </v-avatar>
              <p class="text-caption user-name">{{ user.name }}</p>
            </router-link>
          </div>
        </v-row>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as SessionService from "../services/SessionService.js";
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
          content: this.$props.device.name,
        },
        {
          title: "App version",
          content: this.$props.device.appVersion,
        },
        {
          title: "Format",
          content: this.$props.media.file.format,
        },
        {
          title: "Début de lecture",
          content: this.formatTime(this.$props.media.startWatch),
        },
      ],
      isFileNameOverflown: false,
      isMediaTitleOverflown: false,
      listSessionServices: [
        {
          id: "Pause",
          title: "Pause Session",
          icon: "mdi-pause",
          value: () => SessionService.sessionPause(this.$props.activityId),
        },
        {
          id: "Play",
          title: "Play Session",
          icon: "mdi-play",
          value: () => SessionService.sessionStart(this.$props.activityId),
        },
        {
          id: "Stop",
          title: "Stop Session",
          icon: "mdi-square",
          fontSize: 11,
          value: () => SessionService.sessionStop(this.$props.activityId),
        },
      ],
    };
  },

  props: {
    isLoading: {
      type: Boolean,
    },
    activityId: {
      type: String,
    },
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
    let fileNameElement = this.$refs.fileName;
    let parentCard = fileNameElement.closest(".v-card");
    if (fileNameElement.offsetWidth > parentCard.offsetWidth) {
      fileNameElement.classList.add("-overflown");
      this.isFileNameOverflown = true;
    }

    let mediaTitleElement = this.$refs.mediaTitle;
    let parentRow = mediaTitleElement.closest(
      ".v-card-actions > .v-row > .v-row"
    );

    if (mediaTitleElement.nextElementSibling) {
      if (
        mediaTitleElement.offsetWidth +
          mediaTitleElement.previousSibling.offsetWidth +
          mediaTitleElement.nextElementSibling.offsetWidth >
        parentRow.offsetWidth
      ) {
        mediaTitleElement.classList.add("-overflown");
        this.isMediaTitleOverflown = true;
      }
    } else if (
      mediaTitleElement.offsetWidth +
        mediaTitleElement.previousSibling.offsetWidth >
      parentRow.offsetWidth
    ) {
      mediaTitleElement.classList.add("-overflown");
      this.isMediaTitleOverflown = true;
    }
  },

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
        return `Pause duration : ${timeFormatted.hh} hours${
          timeFormatted.hh > 1 ? "s" : ""
        }, ${timeFormatted.mm} minutes and ${timeFormatted.ss} seconds`;
      } else {
        return `Pause duration : ${timeFormatted.mm} minutes and ${timeFormatted.ss} seconds`;
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
      let logo = this.$props.device.logo;
      return "/Player-logos/" + logo + ".png";
    },
    getListSessionServices() {
      let arr = [];
      this.$props.media.pause.isPaused
        ? arr.push(this.listSessionServices[1])
        : arr.push(this.listSessionServices[0]);
      arr.push(this.listSessionServices[2]);
      return arr;
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
    emitStopAllSessions() {
      this.$emit("stopAllSessions");
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
    background: linear-gradient(270deg, #121212ff, #12121200 90%) !important;
    position: relative;

    .movie-image {
      img {
        aspect-ratio: 150 / 225;
      }
    }

    .file-name {
      white-space: nowrap;
      cursor: default;

      &.-overflown {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

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
      position: absolute;
      top: 0;
      left: 0;
    }

    & > .v-row {
      width: 100%;
      position: relative;

      & > .v-row {
        width: 100%;
        max-width: calc(100% - 40px);
        flex-wrap: nowrap;

        .playing-state {
          margin-top: -4px;
        }

        .media-title {
          white-space: pre;

          &.-overflown {
            overflow: hidden;
            text-overflow: ellipsis;
            height: 1.25rem;
            white-space: nowrap;
          }
        }

        .show-episode {
          white-space: nowrap;
        }

        .user-avatar__wrapper {
          position: absolute;
          right: 0;
          top: -2px;

          .user-avatar__link {
            cursor: pointer;
            color: inherit;

            * {
              cursor: pointer;
              text-decoration: none;
            }
          }

          .user-avatar__image {
            &.-has-picture {
              background-color: transparent !important;

              img {
                max-height: 100%;
                max-width: 100%;
              }
            }
          }

          .user-name {
            position: absolute;
            top: 2rem;
            right: 0;
            white-space: nowrap;
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

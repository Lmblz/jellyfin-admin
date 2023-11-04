<template>
  <v-card
    elevation="12"
    rounded="lg"
    width="100%"
    height="100%"
    variant="tonal"
    :image="posterBaseUrl + movie.backdrop_path"
    v-if="!isMovieLoading"
    class="d-flex flex-column"
  >
    <v-row class="pa-2 ma-0">
      <v-avatar
        color="primary"
        size="x-small"
        class="user-avatar"
        :title="userName"
        ><b>{{ userName.split("")[0].toUpperCase() }}</b></v-avatar
      >
      <v-col cols="11" justify-self="end" class="">
        <v-list class="bg-transparent" append-icon="mid-play">
          <p class="text-h5 font-weight-bold">{{ movie.title }}</p>
          <p>{{ movie.vote_average }}</p>
          <p>{{ movie.release_date }}</p>
        </v-list>
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
      </v-col>
    </v-row>
    <v-card-actions class="pa-2 pt-3 w-100 flex-wrap bg-background">
      <div
        class="progress-bar bg-primary"
        :style="{ width: percentWatch + '%' }"
      ></div>
      <v-icon
        :icon="playMethod == 'directPlay' ? 'mdi-play' : 'mdi-pause'"
      ></v-icon>
      <v-spacer></v-spacer>
      <p>
        {{ movieDurationWatchedFormatted() }} / {{ movieDuractionFormatted() }}
      </p>
    </v-card-actions>
  </v-card>

  <v-card
    v-else
    elevation="12"
    rounded="lg"
    width="100%"
    height="300px"
    variant="tonal"
    loading="true"
  >
  </v-card>
</template>

<script>
import * as MoviesService from "../services/MoviesService.js";
export default {
  data() {
    return {
      isMovieLoading: true,
      moviePercentWatched: 0,
      movieDuration: 0,
      posterBaseUrl: "https://image.tmdb.org/t/p/original/",
      movie: {},
      listElementsInCard: [
        {
          title: "App",
          content: this.deviceAppName,
        },
        {
          title: "App version",
          content: this.deviceAppVersion,
        },
        {
          title: "Codec",
          content: this.extraCodecInfo,
        },
        {
          title: "Nom du fichier",
          content: this.mediaFileName,
        },
      ],
    };
  },

  props: {
    activityId: {
      type: String,
      default: "0",
    },
    movieId: {
      type: Number,
    },
    userName: {
      type: String,
      default: "undefined",
    },
    deviceAppName: {
      type: String,
      default: "undefined",
    },
    deviceAppVersion: {
      type: String,
      default: "undefined",
    },
    extraCodecInfo: {
      type: String,
      default: "undefined",
    },
    mediaFileName: {
      type: String,
      default: "undefined",
    },
    playMethod: {
      type: String,
      default: "",
    },
    percentWatch: {
      type: Number,
      default: 0,
    },
  },

  async created() {
    try {
      this.movie = await MoviesService.getMovie(this.$props.movieId);
    } catch (e) {
      console.log(e);
    }

    console.log(this.movie);
    this.isMovieLoading = false;
    this.movieDuration = this.movie.runtime;
    this.moviePercentWatched = this.$props.percentWatch;

    this.movieDurationWatchedFormatted();
    this.movieDuractionFormatted();
  },

  methods: {
    movieDurationWatchedFormatted() {
      let m = this.movieDuration * (this.moviePercentWatched / 100);
      return new Date(m * 60 * 1000).toISOString().substr(11, 8);
    },
    movieDuractionFormatted() {
      let m = this.movieDuration;
      return new Date(m * 60 * 1000).toISOString().substr(11, 8);
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

    .user-avatar {
      position: absolute;
      top: 10px;
      right: 10px;
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
  }
}
</style>

<template>
  <v-card elevation="12" rounded="lg" width="100%" variant="tonal">
    <v-row class="pa-2">
      <v-col cols="5" class="">
        <v-img class="rounded" :src="posterBaseUrl + movie.poster_path" />
      </v-col>
      <v-col cols="7" justify-self="end" class="pl-0">
        <v-list class="bg-transparent pa-0">
          <v-list-item class="pa-0" min-height="0">
            <p class="text-caption">App : {{ deviceAppName }}</p>
          </v-list-item>

          <v-list-item class="pa-0" min-height="0">
            <p class="text-caption">App version : {{ deviceAppVersion }}</p>
          </v-list-item>

          <v-list-item class="pa-0" min-height="0">
            <p class="text-caption">Codec : {{ extraCodecInfo }}</p>
          </v-list-item>

          <v-list-item class="pa-0" min-height="0">
            <p class="text-caption">Nom du fichier : {{ mediaFileName }}</p>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-card-actions class="pa-2 w-100 flex-wrap">
      <div class="w-100 mb-1">
        <v-avatar color="primary" size="x-small"
          ><b>{{ userName.split("")[0].toUpperCase() }}</b></v-avatar
        >
      </div>
      <v-icon :icon="playMethod ? 'mdi-play' : 'mdi-pause'"></v-icon>
      <p>{{ movie.title }}</p>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as MoviesService from "../services/MoviesService.js";
export default {
  data() {
    return {
      posterBaseUrl: "https://image.tmdb.org/t/p/original/",
      movie: {},
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
      type: Boolean,
      default: false,
    },
  },

  async created() {
    try {
      this.movie = await MoviesService.getMovie(this.$props.movieId);
    } catch (e) {
      console.log(e);
    }
    console.log(this.movie);
  },
};
</script>

<style lang="scss" scoped>
.v-list-item--density-default {
  min-height: inherit;
}
</style>

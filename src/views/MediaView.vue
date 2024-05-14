<template>{{ mediaData.title }}</template>
<script>
import * as LibrariesService from "../services/LibrariesService";

export default {
  data() {
    return {
      mediaData: {},
      movieId: null,
      tmdbData: null,
    };
  },

  async mounted() {
    this.movieId = this.$route.params.id;
    this.getMediaData(this.movieId);
    // console.log(this.mediaData.tmdbId);
    // this.getTmdbData(this.mediaData.tmdbId);
  },

  methods: {
    async getMediaData(id) {
      try {
        this.mediaData = await LibrariesService.getMediaInfos(id);
        console.log(this.mediaData);
      } catch (e) {
        console.error(e);
      }
    },

    // async getTmdbData(id) {
    //   try {
    //     this.tmdbData = await LibrariesService.getMediaTmdbInfos(id);
    //     console.log(this.tmdbData);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // },
  },
};
</script>

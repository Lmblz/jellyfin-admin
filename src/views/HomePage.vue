<template>
  <h1>Homepage</h1>
  <v-row class="ma-0">
    <slot v-if="isNowLoading">
      <v-skeleton-loader
        v-for="i in 3"
        :key="i"
        type="card"
        width="400px"
        height="56px"
        class="overflow-hidden"
      />
    </slot>
    <movie-card v-for="user in now" :key="user" :id="user.id" />
  </v-row>
</template>

<script>
import * as NowService from "../services/NowService.js";
import MovieCard from "../components/MovieCard";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
export default {
  data() {
    return {
      isNowLoading: true,
      now: {},
    };
  },

  components: {
    MovieCard,
    VSkeletonLoader,
  },

  async created() {
    try {
      this.now = await NowService.getAll();
    } catch (e) {
      console.log(e);
    }
    console.log(this.now);
    this.isNowLoading = false;
  },
};
</script>

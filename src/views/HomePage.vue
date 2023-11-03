<template>
  <v-row class="ma-0">
    <slot v-if="areActivitiesLoading">
      <v-col v-for="i in 3" :key="i" cols="4">
        <v-skeleton-loader type="card" class="overflow-hidden" />
      </v-col>
    </slot>
    <v-col v-for="activity in activities" :key="activity" cols="4">
      <movie-card
        :activityId="activity.id"
        :movieId="activity.movieId"
        :userName="activity.userName"
        :deviceAppName="activity.deviceAppName"
        :deviceAppVersion="activity.deviceAppVersion"
        :extraCodecInfo="activity.extraCodecInfo"
        :mediaFileName="activity.mediaFileName"
      />
    </v-col>
  </v-row>
</template>

<script>
import * as ActivitiesService from "../services/ActivitiesService.js";
import MovieCard from "../components/MovieCard";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
export default {
  data() {
    return {
      areActivitiesLoading: true,
      activities: {},
    };
  },

  components: {
    MovieCard,
    VSkeletonLoader,
  },

  async created() {
    try {
      this.activities = await ActivitiesService.getAll();
    } catch (e) {
      console.log(e);
    }
    console.log(this.activities);
    this.areActivitiesLoading = false;
  },
};
</script>

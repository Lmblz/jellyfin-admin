<template>
  <v-row class="ma-0">
    <slot v-if="areActivitiesLoading">
      <v-col v-for="i in 3" :key="i" cols="4">
        <v-skeleton-loader type="card" class="overflow-hidden" />
      </v-col>
    </slot>
    <v-col
      v-else
      v-for="activity in activities"
      :key="generateKey(activity.userName, activity.tmdbId)"
      xl="3"
      lg="4"
      md="6"
      cols="12"
    >
      <activity-card
        :user="{
          name: activity.userName,
          ip: activity.ip,
        }"
        :device="{
          appName: activity.deviceAppName,
          appVersion: activity.deviceAppVersion,
        }"
        :media="{
          id: activity.tmdbId,
          title: activity.title,
          type: activity.mediaType,
          percentWatch: activity.percentWatch,
          playMethod: activity.playMethod,
          posterId: activity.posterId,
          remaningTime: activity.remaningTime,
          saison: activity.saison,
          startWatch: activity.startWatch,
          file: {
            name: activity.fileName,
            runtime: activity.fileRuntime,
            library: activity.library,
            codec: activity.fileExtraCodecInfo,
          },
          pause: {
            isPaused: activity.isPaused,
            pauseDuration: activity.pauseDuration,
          },
        }"
      />
    </v-col>
  </v-row>
</template>

<script>
import * as ActivitiesService from "../services/ActivitiesService.js";
import ActivityCard from "../components/ActivityCard";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
export default {
  data() {
    return {
      areActivitiesLoading: true,
      activities: {},
    };
  },

  components: {
    ActivityCard,
    VSkeletonLoader,
  },

  async created() {
    await this.getActivities();
    this.areActivitiesLoading = false;

    // this.intervalId = setInterval(async () => {
    //   await this.getActivities();
    // }, 5000);
  },

  methods: {
    async getActivities() {
      try {
        this.activities = await ActivitiesService.getAll();
      } catch (e) {
        console.log(e);
      }
    },
    generateKey(...params) {
      let key = "";
      params.forEach((param) => {
        key += param;
      });
      return key;
    },
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>

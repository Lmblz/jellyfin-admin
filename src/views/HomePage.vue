<template>
  <v-row class="ma-0">
    <slot v-if="areActivitiesLoading">
      <v-col v-for="i in 6" :key="i" xxl="2" lg="3" md="6" cols="12">
        <v-skeleton-loader type="card" class="overflow-hidden" />
      </v-col>
    </slot>
    <v-col
      v-else
      v-for="activity in activities"
      :key="activity.id"
      xxl="2"
      lg="3"
      md="6"
      cols="12"
    >
      <activity-card
        :activityId="activity.id"
        :user="{
          name: activity.userName,
          ip: activity.ip,
          id: activity.userId,
          hasPicture: activity.userHasPicture,
        }"
        :device="{
          name: activity.deviceName,
          appName: activity.deviceAppName,
          appVersion: activity.deviceAppVersion,
          logo: activity.deviceLogo,
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
          episode: activity.episode,
          startWatch: activity.startWatch,
          posterColor: activity.posterColor,
          file: {
            name: activity.fileName,
            runtime: activity.fileRuntime,
            library: activity.library,
            format: activity.format,
          },
          pause: {
            isPaused: activity.isPaused,
            pauseDuration: activity.pauseDuration,
          },
        }"
        @stopAllSessions="stopAllSessions"
      />
    </v-col>
    <template>
      <div class="text-center">
        <v-dialog v-model="showStopAllDialog" width="500">
          <v-card>
            <v-card-text>
              <v-text-field
                label="Message to display"
                v-model="stopAllMessage"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="justify-space-between">
              <v-btn color="primary" @click="cancelStopAll">Back</v-btn>
              <v-btn color="primary" @click="submitStopAll"
                >Stop all sessions</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <h2 class="ma-2" v-if="activities.length == 0">
      C'est bien calme par ici...
    </h2>
  </v-row>
</template>

<script>
import * as ActivitiesService from "../services/ActivitiesService.js";
import { sessionStopAll } from "../services/SessionService.js";
import ActivityCard from "../components/ActivityCard.vue";
export default {
  data() {
    return {
      areActivitiesLoading: true,
      activities: {},
      showStopAllDialog: false,
      stopAllMessage: "",
    };
  },

  components: {
    ActivityCard,
  },

  async created() {
    await this.getActivities();
    this.areActivitiesLoading = false;

    this.intervalId = setInterval(async () => {
      await this.getActivities();
    }, 10000);
  },

  async mounted() {
    await this.getActivities();
    this.areActivitiesLoading = false;
  },

  methods: {
    async getActivities() {
      try {
        this.activities = await ActivitiesService.getAll();
      } catch (e) {
        console.error(e);
      }
    },
    stopAllSessions() {
      this.showStopAllDialog = true;
    },
    cancelStopAll() {
      this.stopAllMessage = "";
      this.showStopAllDialog = false;
    },
    submitStopAll() {
      try {
        sessionStopAll(this.stopAllMessage);
      } catch (e) {
        console.error(e);
      }

      this.showStopAllDialog = false;
    },
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>

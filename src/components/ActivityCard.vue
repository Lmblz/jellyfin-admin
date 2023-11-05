<template>
  <v-card
    elevation="12"
    rounded="lg"
    width="100%"
    height="100%"
    variant="tonal"
    class="d-flex flex-column bg-background"
  >
    <v-row class="pa-2 ma-0">
      <v-avatar
        color="primary"
        size="x-small"
        class="user-avatar"
        :title="user.name"
        ><b>{{ user.name.split("")[0].toUpperCase() }}</b></v-avatar
      >
      <v-col cols="11" justify-self="end" class="">
        <v-list class="bg-transparent" append-icon="mid-play">
          <p class="text-h5 font-weight-bold">{{ media.title }}</p>
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
        :style="{ width: media.percentWatch + '%' }"
      ></div>
      <v-icon :icon="media.pause.isPaused ? 'mdi-pause' : 'mdi-play'"></v-icon>
      <v-spacer></v-spacer>
      <p>
        <!-- {{ movieDurationWatchedFormatted() }} / {{ movieDuractionFormatted() }} -->
      </p>
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

  computed: {},

  methods: {},
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

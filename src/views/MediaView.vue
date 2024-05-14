<template>
  <!-- #region Hero banner -->
  <v-row
    class="ma-0 align-center justify-center flex-wrap hero-section"
    :style="!tmdbLoading ? backdropStyle : ''"
    style="
      background-size: cover;
      background-position: top center;
      height: 80dvh;
    "
  >
    <v-col
      cols="12"
      sm="5"
      class="h-100 d-flex flex-column justify-center hero-section__main"
    >
      <h1>{{ mediaData.title }}</h1>
      <!-- #region Genre -->
      <v-row class="ma-0 mt-4" style="flex: 0" v-if="!tmdbLoading">
        <p
          v-for="(genre, index) in tmdbData.genres"
          :key="index"
          class="mr-4 text-caption"
          style="height: fit-content"
        >
          {{ genre.name }}
        </p>
      </v-row>
      <v-row class="ma-0 mt-4" style="flex: 0" v-else>
        <p
          v-for="(i, index) in 2"
          :key="index"
          class="mr-4"
          style="height: fit-content; width: 100px"
        >
          <v-skeleton-loader
            class="loader-genres"
            type="text"
            style="height: 20px"
          ></v-skeleton-loader>
        </p>
      </v-row>
      <!-- #endregion -->
      <!-- #region Date -->
      <b class="text-h6 font-weight-black mt-4" v-if="!tmdbLoading">
        {{
          mediaData.type == "tv"
            ? tmdbData.first_air_date.split("-")[0]
            : tmdbData.release_date.split("-")[0]
        }}
      </b>
      <b class="text-h6 font-weight-black mt-4" v-else>
        <v-skeleton-loader
          class="loader-year"
          type="text"
          style="height: 32px"
        ></v-skeleton-loader>
      </b>
      <!-- #endregion -->
    </v-col>
    <v-col xxl="2" md="4" sm="6" cols="12" class="hero-section__image">
      <v-responsive
        :aspect-ratio="9 / 16"
        style="max-height: calc(60dvh - 100px)"
      >
        <v-card
          class="h-100 image__card"
          :elevation="4"
          style="width: fit-content; margin: auto"
        >
          <img
            :src="
              'https://j.nimi.ovh/items/' +
              mediaData.mediaPictureId +
              '/Images/Primary'
            "
            style="height: 100%"
        /></v-card>
      </v-responsive>
    </v-col>
  </v-row>
  <!-- #endregion -->
  <!-- #region Description card -->
  <v-row class="justify-center ma-0">
    <v-col class="" cols="12" sm="10" md="8" lg="6" xl="5" xxl="4">
      <v-card
        v-if="!tmdbLoading && !dataLoading"
        class="mt-n16 pa-4 pr-0"
        theme="light"
        elevation="24"
        color="background"
        style="transform: translateY(-20px)"
      >
        <!-- #region Card top -->
        <v-row class="ma-0 mb-6 align-center justify-space-between pr-4">
          <!-- #region Media length -->
          <p v-if="mediaData.type == 'tv'" class="font-weight-bold">
            {{ getTvShowLength }}
          </p>
          <p v-else class="font-weight-bold">
            {{
              Math.floor(tmdbData.runtime / 60)
                .toString()
                .padStart(2, "0")
            }}h {{ (tmdbData.runtime % 60).toString().padStart(2, "0") }}min
          </p>
          <!-- #endregion -->
          <!-- #region Rating -->
          <v-btn
            elevation="12"
            variant="flat"
            color="gold"
            prependIcon="mdi-star"
          >
            {{ getRateValue(tmdbData.vote_average) }} / 10
          </v-btn>
          <!-- #endregion -->
        </v-row>
        <!-- #endregion -->
        <!-- #region Overview -->
        <p class="ma-2 pr-4">{{ tmdbData.overview }}</p>
        <!-- #endregion -->
        <!-- #region Created by -->
        <!-- <slot v-if="tmdbData.created_by && tmdbData.created_by.length > 0">
            <p class="font-weight-bold mt-6">Created by</p>
            <v-row class="ma-0">
              <p
                v-for="(creator, index) in tmdbData.created_by"
                :key="index"
                class="pr-4"
              >
                {{ creator.name }}
              </p>
            </v-row>
          </slot> -->
        <!-- #endregion -->
        <!-- #region Casting -->
        <slot v-if="mediaData && mediaData.casting.length > 0">
          <swiper
            class="mt-6"
            :slidesPerView="'auto'"
            :spaceBetween="30"
            :freeMmode="true"
            :center-insufficient-slides="true"
          >
            <swiper-slide
              v-for="(cast, index) in mediaData.casting"
              :key="index"
              class="d-flex flex-column align-center"
              style="width: 100px"
            >
              <v-avatar color="primary" size="80">
                <v-img
                  :src="
                    'https://j.nimi.ovh/items/' + cast.id + '/Images/Primary'
                  "
                  width="50px"
                />
              </v-avatar>
              <p
                class="text-caption text-center mt-1 members-name"
                style="line-height: 1.2"
              >
                {{ cast.name }}
              </p>
              <p
                class="text-caption text-center mt-1 members-name"
                style="line-height: 1.2"
              >
                ({{ cast.character }})
              </p>
            </swiper-slide>
          </swiper>
        </slot>
        <!-- #endregion -->
      </v-card>
      <v-skeleton-loader
        v-else
        class="mt-n16 pa-4"
        theme="light"
        elevation="24"
        color="background"
        style="transform: translateY(-20px)"
        type="image, article"
      ></v-skeleton-loader>
    </v-col>
  </v-row>
  <!-- #endregion -->
  <history-table
    v-if="!dataLoading"
    :nbResults="10"
    :default-filter="[{ param: 'fileId', value: mediaData.mediaPictureId }]"
    no-data="No one has seen this media :("
    class="mb-4"
    @errorEvent="showError"
  />
  <v-skeleton-loader v-else type="table" class="mb-4"></v-skeleton-loader>
  <v-snackbar
    v-model="hasError"
    title="Error"
    location="top right"
    variant="flat"
    color="error"
  >
    <h3>Error - {{ errorContext }}</h3>
    <p>{{ errorMessage }}</p>
    <template v-slot:actions>
      <v-btn icon="mdi-close" @click="hasError = false"> </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import HistoryTable from "@/components/HistoryTable.vue";
import * as LibrariesService from "../services/LibrariesService";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

export default {
  data() {
    return {
      mediaData: {},
      mediaId: null,
      tmdbData: null,
      casting: null,
      tmdbLoading: true,
      dataLoading: true,
      castingLoading: true,
      hasError: false,
      errorMessage: null,
      errorContext: null,
    };
  },

  components: {
    Swiper,
    SwiperSlide,
    HistoryTable,
  },

  setup() {},

  created() {
    this.mediaId = this.$route.params.id;
  },

  async mounted() {
    await this.getMediaData(this.mediaId);
    switch (this.mediaData.type) {
      case "tv":
        this.getTvShowInfos();
        this.getTvShowCasting();
        break;
      case "movie":
        this.getMovieInfos();
        this.getMovieCasting();
        break;
    }
  },

  methods: {
    async getMediaData(id) {
      this.dataLoading = true;
      try {
        this.mediaData = await LibrariesService.getMediaInfos(id);
        console.log(this.mediaData);
      } catch (e) {
        console.error(e);
        this.showError({ context: "Media", message: e.message });
      }
      this.dataLoading = false;
    },

    async getTvShowInfos() {
      try {
        this.tmdbLoading = true;
        this.tmdbData = await LibrariesService.getTvShowInfos(
          this.mediaData.tmdbId,
          "fr-FR"
        );
        console.log(this.tmdbData);
        this.tmdbLoading = false;
        //console.log(this.tmdbData);
      } catch (e) {
        console.error(e);
        this.showError("errorEvent", { context: "Media", message: e.message });

        this.tmdbLoading = false;
      }
    },

    async getTvShowCasting() {
      this.castingLoading = true;
      try {
        this.casting = await LibrariesService.getTvShowCasting(
          this.mediaData.tmdbId,
          "fr-FR"
        );
        //console.log(this.casting);
      } catch (e) {
        console.error(e);
        this.showError("errorEvent", { context: "Media", message: e.message });
      }
      this.castingLoading = false;
    },

    async getMovieInfos() {
      try {
        this.tmdbLoading = true;
        this.tmdbData = await LibrariesService.getMovieInfos(
          this.mediaData.tmdbId,
          "fr-FR"
        );
        //console.log(this.tmdbData);
        this.tmdbLoading = false;
      } catch (e) {
        console.error(e);
        this.showError("errorEvent", { context: "Media", message: e.message });
        this.tmdbLoading = false;
      }
    },

    async getMovieCasting() {
      this.castingLoading = true;
      try {
        this.casting = await LibrariesService.getMovieCasting(
          this.mediaData.tmdbId,
          "fr-FR"
        );
        //console.log(this.casting);
      } catch (e) {
        console.error(e);
        this.showError("errorEvent", { context: "Media", message: e.message });
      }
      this.castingLoading = false;
    },

    getRateValue(value) {
      return Math.round(value * 10) / 10;
    },

    showError({ context, message }) {
      this.errorMessage = message;
      this.errorContext = context;
      this.hasError = true;
    },
  },

  computed: {
    backdropStyle() {
      return {
        "background-image": `linear-gradient(rgba(0, 0, 0, 0.2), ${this.$vuetify.theme.current.colors.background}), url('https://media.themoviedb.org/t/p/w1920_and_h1080_multi_faces/${this.tmdbData.backdrop_path}')`,
      };
    },

    getTvShowLength() {
      console.log();
      const seasons = this.mediaData.saisons;
      const nbSeasons = seasons.length;
      let nbEpisodes = 0;

      seasons.forEach((season) => {
        nbEpisodes += season.episodeCount;
      });

      return (
        nbSeasons +
        (nbSeasons > 1 ? " saisons" : " saison") +
        " - " +
        nbEpisodes +
        (nbEpisodes > 1 ? " épisodes" : " épisode")
      );
    },
  },
};
</script>

<style lang="scss">
.hero-section {
  @media all and (max-width: 600px) {
    align-items: inherit !important;
    justify-content: inherit !important;
    align-content: flex-start;

    &__main {
      height: fit-content !important;
    }

    &__image {
      .image__card {
        height: 100%;
      }
    }
  }
}

.members-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  @supports (-webkit-line-clamp: 2) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.loader {
  &-genres {
    .v-skeleton-loader__bone {
      margin: 4px;
    }
  }

  &-year {
    .v-skeleton-loader__bone {
      margin: 10px;
    }
  }
}
</style>

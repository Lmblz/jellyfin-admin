<template>
  <!-- #region Hero banner -->
  <v-row
    class="ma-0"
    :style="!tmdbLoading ? backdropStyle : ''"
    style="
      background-size: cover;
      background-position: top center;
      height: 75dvh;
    "
  >
    <v-col cols="1"></v-col>
    <v-col cols="8" class="h-100 d-flex flex-column justify-center">
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
  </v-row>
  <!-- #endregion -->
  <!-- #region Description card -->
  <v-row class="justify-center ma-0">
    <v-col class="" cols="8">
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
        <slot v-if="tmdbData.created_by && tmdbData.created_by.length > 0">
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
        </slot>
        <!-- #endregion -->
        <!-- #region Casting -->
        <slot v-if="casting && casting.cast.length > 0">
          <p class="font-weight-bold mt-6 pr-4">Casting</p>
          <swiper
            class="mt-2"
            :slidesPerView="'auto'"
            :spaceBetween="30"
            :freeMmode="true"
          >
            <swiper-slide
              v-for="(cast, index) in casting.cast"
              :key="index"
              class="d-flex flex-column align-center"
              style="width: 60px"
            >
              <v-avatar color="primary">
                <v-img
                  v-if="cast.profile_path"
                  :src="
                    'https://media.themoviedb.org/t/p/w138_and_h175_face/' +
                    cast.profile_path
                  "
                />
                <p v-else>{{ cast.original_name[0] }}</p>
              </v-avatar>
              <p
                class="text-caption text-center mt-1 members-name"
                style="line-height: 1.2"
              >
                {{ cast.original_name }}
              </p>
            </swiper-slide>
          </swiper>
        </slot>
        <!-- #endregion -->
        <!-- #region Casting -->
        <slot v-if="casting && casting.crew.length > 0">
          <p class="font-weight-bold mt-4">Crew</p>
          <swiper
            class="mt-2"
            :slidesPerView="'auto'"
            :spaceBetween="30"
            :freeMmode="true"
          >
            <swiper-slide
              v-for="(member, index) in casting.crew"
              :key="index"
              class="d-flex flex-column align-center"
              style="width: 60px"
            >
              <v-avatar color="primary">
                <v-img
                  v-if="member.profile_path"
                  :src="
                    'https://media.themoviedb.org/t/p/w138_and_h175_face/' +
                    member.profile_path
                  "
                />
                <p v-else>{{ member.original_name[0] }}</p>
              </v-avatar>
              <p
                class="text-caption text-center mt-1 members-name"
                style="line-height: 1.2"
              >
                {{ member.original_name }}
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
  />
  <v-skeleton-loader v-else type="table" class="mb-4"></v-skeleton-loader>
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
      }
      this.castingLoading = false;
    },

    getRateValue(value) {
      return Math.round(value * 10) / 10;
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

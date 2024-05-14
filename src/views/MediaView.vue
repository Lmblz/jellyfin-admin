<template>
  <v-row v-if="tmdbData" class="ma-0" :style="backdropStyle">
    <!-- <v-col cols="6" class="">
        <v-card v-if="mediaData" elevation="4">
          <v-img
            :src="
              'https://j.nimi.ovh/items/' +
              mediaData.mediaPictureId +
              '/Images/Primary'
            "
            cover
          />
        </v-card>
      </v-col> -->
    <v-col cols="1"></v-col>
    <v-col
      cols="8"
      class="h-100 d-flex flex-column justify-center"
      v-if="tmdbData"
    >
      <h1>{{ mediaData.title }}</h1>

      <v-row class="ma-0 mt-4" style="flex: 0">
        <p
          v-for="(genre, index) in tmdbData.genres"
          :key="index"
          class="mr-4 text-caption"
          style="height: fit-content"
        >
          {{ genre.name }}
        </p>
      </v-row>
      <b class="text-h6 font-weight-black mt-4">{{
        mediaData.type == "tv"
          ? tmdbData.first_air_date.split("-")[0]
          : tmdbData.release_date.split("-")[0]
      }}</b>
    </v-col>
  </v-row>
  <v-row class="justify-center ma-0">
    <v-col class="" cols="8">
      <v-card
        class="mt-n16 pa-4 pr-0"
        theme="light"
        elevation="24"
        color="background"
        style="transform: translateY(-20px)"
        v-if="tmdbData"
      >
        <v-row class="ma-0 mb-6 align-center justify-space-between pr-4">
          <p v-if="mediaData.type == 'tv'" class="font-weight-bold">
            {{ tmdbData.number_of_seasons }} saison
            {{ tmdbData.number_of_seasons > 1 ? "s" : "" }} -
            {{ tmdbData.number_of_episodes }} épisodes
          </p>
          <p v-else class="font-weight-bold">
            {{
              Math.floor(tmdbData.runtime / 60)
                .toString()
                .padStart(2, "0") +
              "h " +
              (tmdbData.runtime % 60).toString().padStart(2, "0") +
              "min"
            }}
          </p>
          <v-btn
            elevation="12"
            variant="flat"
            color="gold"
            prependIcon="mdi-star"
            >{{ getRateValue(tmdbData.vote_average) }} / 10</v-btn
          >
        </v-row>

        <p class="ma-2 pr-4">{{ tmdbData.overview }}</p>
        <p
          v-for="(creator, index) in tmdbData.created_by"
          :key="index"
          class="pr-4"
        >
          {{ creator.name }}
        </p>
        <p class="font-weight-bold mt-6 pr-4">Casting</p>
        <swiper
          class="mt-2"
          :slidesPerView="'auto'"
          :spaceBetween="30"
          :freeMmode="true"
          v-if="casting"
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
            </p></swiper-slide
          >
        </swiper>
        <p class="font-weight-bold mt-4">Crew</p>
        <swiper
          class="mt-2"
          :slidesPerView="'auto'"
          :spaceBetween="30"
          :freeMmode="true"
          v-if="casting"
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
            </p></swiper-slide
          >
        </swiper>
      </v-card>
    </v-col>
  </v-row>
  <history-table
    v-if="mediaData.mediaPictureId"
    :nbResults="10"
    :default-filter="[{ param: 'fileId', value: mediaData.mediaPictureId }]"
  ></history-table>
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
      try {
        this.mediaData = await LibrariesService.getMediaInfos(id);
        console.log(this.mediaData);
      } catch (e) {
        console.error(e);
      }
    },

    async getTvShowInfos() {
      try {
        this.tmdbData = await LibrariesService.getTvShowInfos(
          this.mediaData.tmdbId,
          "fr-FR"
        );
        //console.log(this.tmdbData);
      } catch (e) {
        console.error(e);
      }
    },

    async getTvShowCasting() {
      try {
        this.casting = await LibrariesService.getTvShowCasting(
          this.mediaData.tmdbId,
          "fr-FR"
        );
        //console.log(this.casting);
      } catch (e) {
        console.error(e);
      }
    },

    async getMovieInfos() {
      try {
        this.tmdbData = await LibrariesService.getMovieInfos(
          this.mediaData.tmdbId,
          "fr-FR"
        );
        //console.log(this.tmdbData);
      } catch (e) {
        console.error(e);
      }
    },

    async getMovieCasting() {
      try {
        this.casting = await LibrariesService.getMovieCasting(
          this.mediaData.tmdbId,
          "fr-FR"
        );
        //console.log(this.casting);
      } catch (e) {
        console.error(e);
      }
    },

    getRateValue(value) {
      return Math.round(value * 10) / 10;
    },
  },

  computed: {
    backdropStyle() {
      return {
        "background-image": `linear-gradient(rgba(0, 0, 0, 0.2), ${this.$vuetify.theme.current.colors.background}), url('https://media.themoviedb.org/t/p/w1920_and_h1080_multi_faces/${this.tmdbData.backdrop_path}')`,
        "background-size": "cover",
        "background-position": "center",
        height: "50vh",
      };
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
</style>

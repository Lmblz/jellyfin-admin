<template>
  <v-row class="ma-0">
    <slot v-if="!isLoading">
      <v-col
        v-if="libraries && libraries.length > 0"
        cols="3"
        v-for="(library, index) in libraries"
        :key="index"
      >
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <LibraryCard
              :style="{
                opacity: isHovering ? hoverOpacity : defaultOpacity,
                transition: 'all .5s',
              }"
              v-bind="props"
              :class="{ 'on-hover': isHovering }"
              :name="library.name"
              :id="library.id"
              :url="'/libraries/' + library.id"
            />
          </template>
        </v-hover>
      </v-col>
    </slot>
    <slot v-else>
      <v-col cols="3" v-for="(i, index) in 8" :key="index">
        <v-responsive :aspect-ratio="16 / 9">
          <v-skeleton-loader
            :elevation="4"
            type="card"
            class="h-100"
          ></v-skeleton-loader>
        </v-responsive>
      </v-col>
    </slot>
  </v-row>
  <!-- API Not implemented yet -->
  <!-- <v-row class="ma-0 justify-center">
      <v-col cols="8">
        <v-card title="Search for a media" class="pa-4">
          <v-form validate-on="submit lazy" class="w-75" @submit.prevent="searchMedia()">
            <v-text-field class="w-100" v-model="search" prepend-inner-icon="mdi-account" append-inner-icon="mdi-magnify"
              label="Search for a user" variant="outlined" clearable density="compact"
              @click:append-inner="searchMedia()"></v-text-field>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="medias">
      <v-col cols="2" v-for="(media, index) in medias" :key="index">
        <MediaCard :name="media.title" :mediaId="media.id" :mediaImage="media.mediaPictureId" />
      </v-col>
    </v-row> -->
</template>

<script>
import LibraryCard from "@/components/LibraryCard.vue";
import MediaCard from "@/components/MediaCard.vue";
import * as LibrariesService from "../services/LibrariesService";
export default {
  data() {
    return {
      libraries: null,
      medias: null,
      isLoading: true,
      isHovering: false,
      hoverOpacity: 0.8,
      defaultOpacity: 1,
      search: "",
    };
  },

  components: { LibraryCard, MediaCard },

  watch: {
    isHovering(newVal, oldVal) {
      console.log(newVal);
    },
  },

  async mounted() {
    this.getLibraries();
  },

  methods: {
    async getLibraries() {
      this.isLoading = true;
      try {
        this.libraries = await LibrariesService.getLibraries();
        //console.log(this.libraries);
      } catch (e) {
        console.error(e);
      }
      this.isLoading = false;
    },

    getLibraryImage(id) {
      return this.baseLibraryImageUrl + id + "/Images/Primary";
    },

    searchMedia(event) {
      console.log(this.search);
    },
  },
};
</script>

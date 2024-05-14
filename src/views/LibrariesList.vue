<template>
  <h1>Libraries</h1>
  <v-row>
    <slot v-if="libraries.length > 0">
      <v-col cols="3" v-for="(library, index) in libraries" :key="index">
        <LibraryCard
          :name="library.name"
          :id="library.id"
          :url="'/libraries/' + library.id"
        ></LibraryCard>
      </v-col>
    </slot>
  </v-row>
</template>

<script>
import LibraryCard from "@/components/LibraryCard.vue";
import * as LibrariesService from "../services/LibrariesService";
export default {
  data() {
    return {
      libraries: "",
    };
  },
  components: [LibraryCard],
  async mounted() {
    this.getLibraries();
  },
  methods: {
    async getLibraries() {
      try {
        this.libraries = await LibrariesService.getLibraries();
        console.log(this.libraries);
      } catch (e) {
        console.error(e);
      }
    },
    getLibraryImage(id) {
      return this.baseLibraryImageUrl + id + "/Images/Primary";
    },
  },
  components: { LibraryCard },
};
</script>

<template>
  <v-card flat class="mt-2">
    <v-card-title class="d-flex align-center">
      <p class="mr-4">Medias</p>
      <v-spacer></v-spacer>
      <v-form
        validate-on="submit lazy"
        class="w-75"
        @submit.prevent="searchMedia()"
      >
        <v-text-field
          class="w-100"
          v-model="search"
          prepend-inner-icon="mdi-account"
          append-inner-icon="mdi-magnify"
          label="Search for a media"
          variant="outlined"
          clearable
          density="compact"
          :single-line="true"
          @click:append-inner="searchMedia()"
        ></v-text-field>
      </v-form>
    </v-card-title>
    <v-data-table-server
      density="comfortable"
      :hover="true"
      fixed-header
      :headers="headers"
      :items="items"
      :items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      :items-length="totalItems"
      :loading="isLoading"
      @update:items-per-page="itemsPerPage = $event"
      @update:options="sortPagination($event)"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template v-slot:item.title="{ item }">
        <router-link
          :to="`/media/${item.id}`"
          style="color: inherit; text-decoration: inherit"
        >
          <p>{{ item.title }}</p>
        </router-link>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import router from "@/router";
import * as LibrariesService from "../services/LibrariesService";

export default {
  data() {
    return {
      result: {},
      items: [],
      libraryId: "",
      headers: [
        {
          title: "Title",
          key: "title",
          sortable: false,
        },
      ],
      itemsPerPage: 20,
      itemsPerPageOptions: [10, 20, 50, 100],
      isLoading: false,
      totalItems: 0,
      search: "",
    };
  },
  props: ["libraryIdProp"],
  created() {},
  mounted() {
    this.libraryId = this.$props.libraryIdProp;
    console.log(this.libraryId);
    this.getLibrary(`?libraryId=${this.libraryId}&nb=${this.itemsPerPage}`);
  },
  methods: {
    async getLibrary(params) {
      try {
        this.result = await LibrariesService.getLibrary(params);
        console.log(this.result);
        this.items = this.result.results;
        this.totalItems = this.result.count;
      } catch (e) {
        console.error(e);
      }
    },
    sortPagination(event) {
      console.log(event);
    },
    searchMedia() {
      console.log("search");
    },
  },
  components: { router },
};
</script>

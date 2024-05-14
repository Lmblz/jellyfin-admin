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
      :sticky="true"
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
          <v-row class="align-center">
            <v-avatar color="primary" size="small" class="mr-4">
              <slot v-if="item.mediaPictureId !== null">
                <img
                  :src="
                    'https://j.nimi.ovh/items/' +
                    item.mediaPictureId +
                    '/Images/Primary'
                  "
                  class="w-100"
                />
              </slot>
            </v-avatar>
            <p>
              {{ item.title }}
              <span class="text-caption" style="opacity: 0.8">
                {{ item.type == "tv" ? " - TV show" : " - Movie" }}
              </span>
            </p>
          </v-row>
        </router-link>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
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
      itemsPerPage: 25,
      itemsPerPageOptions: [10, 25, 50, 100],
      currentPage: 0,
      isLoading: false,
      totalItems: 0,
      search: "",
    };
  },

  props: {
    defaultFilter: {
      type: Array,
    },
  },

  created() {},

  mounted() {
    this.getLibrary();
  },

  methods: {
    async getLibrary() {
      this.isLoading = true;
      let params = [];
      const defaultFilter = this.$props.defaultFilter;

      // Default filters based on context
      if (defaultFilter !== undefined) {
        defaultFilter.forEach((filter, index) => {
          params.push({ param: filter.param, value: filter.value });
        });
      }

      // Number of results
      if (this.itemsPerPage > 0) {
        params.push({ param: "nb", value: this.itemsPerPage });
      }

      // Start
      if (this.currentPage > 0) {
        params.push({
          param: "start",
          value: (this.currentPage - 1) * this.itemsPerPage,
        });
      }

      let paramsString = "";

      if (params.length > 0) {
        paramsString += "?";
        params.forEach((param, index) => {
          let newParam = "";
          if (index !== 0) newParam += "&";
          newParam += param.param + "=" + param.value;
          paramsString += newParam;
        });
      }

      try {
        this.result = await LibrariesService.getLibrary(paramsString);
        console.log(this.result);
        this.items = this.result.results;
        this.totalItems = this.result.count;
      } catch (e) {
        console.error(e);
        this.$emit("errorEvent", { context: "Media", message: e.message });
      }

      this.isLoading = false;
    },
    sortPagination(event) {
      this.currentPage = event.page;
      this.getLibrary();
    },
    searchMedia() {
      console.log("search");
    },
  },
};
</script>

<template>
  <v-responsive :aspect-ratio="16 / 9">
    <v-card
      class="h-100"
      :title="name"
      :image="getLibraryImage(id)"
      :to="url"
      :elevation="4"
    ></v-card>
  </v-responsive>
</template>

<script>
export default {
  data() {
    return {
      baseLibraryImageUrl: "https://j.nimi.ovh/Items/",
    };
  },

  props: ["name", "id", "url"],

  methods: {
    getLibraryImage(id) {
      return this.baseLibraryImageUrl + id + "/Images/Primary";
    },
  },
};
</script>

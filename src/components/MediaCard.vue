<template>
  <v-responsive :aspect-ratio="9 / 16">
    <v-card
      class="h-100"
      :title="name"
      :image="'https://j.nimi.ovh/items/' + mediaId + '/Images/Primary'"
      to="url"
      :elevation="4"
    ></v-card>
  </v-responsive>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    name: {
      type: String,
      required: true,
    },
    mediaId: {
      type: String,
      required: true,
    },
    mediaImage: {
      type: String,
      required: true,
    },
  },
};
</script>

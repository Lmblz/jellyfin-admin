<template>
  <media-table :libraryIdProp="libraryId"></media-table>
</template>

<script>
import MediaTable from "@/components/MediaTable.vue";

export default {
  data() {
    return {
      libraryId: "",
      medias: [],
    };
  },

  components: { MediaTable },

  created() {
    this.libraryId = this.$route.params.id;
    console.log(this.libraryId);
  },

  methods: {},
};
</script>

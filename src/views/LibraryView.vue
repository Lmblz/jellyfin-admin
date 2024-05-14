<template>
  <MediaTable
    v-if="libraryId"
    :defaultFilter="[{ param: 'libraryId', value: libraryId }]"
  >
  </MediaTable>
</template>

<script>
import MediaTable from "@/components/MediaTable.vue";

export default {
  data() {
    return {
      libraryId: null,
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

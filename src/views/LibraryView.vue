<template>
  <MediaTable
    v-if="libraryId"
    :defaultFilter="[{ param: 'libraryId', value: libraryId }]"
    @errorEvent="showError"
  >
  </MediaTable>
  <v-snackbar
    v-model="hasError"
    title="Error"
    location="top right"
    variant="flat"
    color="error"
  >
    <h3>Error - {{ errorContext }}</h3>
    <p>{{ errorMessage }}</p>
    <template v-slot:actions>
      <v-btn icon="mdi-close" @click="hasError = false"> </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import MediaTable from "@/components/MediaTable.vue";

export default {
  data() {
    return {
      libraryId: null,
      hasError: false,
      errorMessage: null,
      errorContext: null,
    };
  },

  components: { MediaTable },

  created() {
    this.libraryId = this.$route.params.id;
    console.log(this.libraryId);
  },

  methods: {
    showError({ context, message }) {
      this.errorMessage = message;
      this.errorContext = context;
      this.hasError = true;
    },
  },
};
</script>

<template>
  <history-table
    context="historyView"
    no-data="There's no result for your filters :("
    @errorEvent="showError"
  />
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
import HistoryTable from "@/components/HistoryTable.vue";

export default {
  data() {
    return {
      hasError: false,
      errorMessage: null,
      errorContext: null,
    };
  },

  components: {
    HistoryTable,
  },

  mounted() {},

  methods: {
    showError({ context, message }) {
      this.errorMessage = message;
      this.errorContext = context;
      this.hasError = true;
    },
  },
};
</script>

<style lang="scss"></style>

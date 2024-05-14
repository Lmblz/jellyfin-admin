<template>
  <history-table
    context="historyView"
    no-data="There's no result for your filters :("
  />
</template>
<script>
import HistoryTable from "@/components/HistoryTable.vue";

export default {
  data() {
    return {};
  },

  components: {
    HistoryTable,
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss"></style>

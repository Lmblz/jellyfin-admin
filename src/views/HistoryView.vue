<template>
  <div>
    <h1>coucou</h1>
    <p>Nb de résultats : {{ history.count }}</p>
    <p>Nb de résultats affiché : {{ history.nb }}</p>
    <p v-for="result in history.results" :key="result.id">
      Item : {{ result }}
    </p>
  </div>
</template>
<script>
import * as HistoryService from "../services/HistoryService.js";
export default {
  data() {
    return {
      history: "",
    };
  },
  mounted() {
    this.getHistory();
  },
  methods: {
    async getHistory() {
      try {
        this.history = await HistoryService.getAll();
      } catch (e) {
        console.log(e);
      }
      console.log(this.history);
    },
  },
};
</script>
<style lang=""></style>

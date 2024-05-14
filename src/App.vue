<template>
  <v-app>
    <AppBar />
    <v-main class="px-2" style="margin-top: 70px"> <router-view /> </v-main>
  </v-app>
</template>

<script>
import AppBar from "./layouts/AppBar.vue";
export default {
  components: {
    AppBar,
  },
  mounted() {},
};
</script>

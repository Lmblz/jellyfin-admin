<template>
  <v-app>
    <AppBar />
    <v-main class="px-2">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "./layouts/AppBar.vue";
export default {
  components: {
    AppBar,
  },
};
</script>

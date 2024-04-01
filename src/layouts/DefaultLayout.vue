<template>
  <v-app>
    <default-bar />

    <default-view />
  </v-app>
</template>

<script>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./AppView.vue";

export default {
  components: {
    DefaultBar,
    DefaultView,
  },
};
</script>

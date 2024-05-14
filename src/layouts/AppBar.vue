<template>
  <header class="main-header">
    <v-card class="pa-6 pl-1 ma-2" elevation="10">
      <v-row class="mx-4 d-flex align-center justify-center">
        <router-link to="/">
          <v-avatar class="pa-1" color="primary" size="32"
            ><v-img src="/favicon-black.png"
          /></v-avatar>
        </router-link>
        <router-link
          v-for="link in links"
          :key="link"
          :to="link.url"
          class="text-white"
        >
          <v-btn :text="link.title" variant="text"></v-btn
        ></router-link>

        <v-spacer></v-spacer>
      </v-row>
    </v-card>
  </header>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          title: "Library",
          url: "/libraries",
        },
        {
          title: "Users",
          url: "/users",
        },
        {
          title: "History",
          url: "/history",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.main-header {
  z-index: 5;
  position: fixed;
  width: 100%;
  top: 0;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 30%,
    rgba(0, 0, 0, 0) 100%
  );
}
</style>

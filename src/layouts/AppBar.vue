<template>
  <v-app-bar flat>
    <v-row class="mx-4 d-flex align-center justify-center">
      <v-avatar class="me-4 pa-1" color="primary" size="32"
        ><v-img src="/favicon-black.png"
      /></v-avatar>
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
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          title: "Home",
          url: "/",
        },
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

<template>
  <v-app-bar flat>
    <v-row class="mx-4 d-flex align-center justify-center">
      <v-avatar class="me-4" color="primary" size="32"><b>J</b></v-avatar>

      <v-btn
        v-for="link in links"
        :key="link"
        :text="link.title"
        variant="text"
      ></v-btn>

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
          title: "Accueil",
          url: "/",
        },
        {
          title: "Librairie",
          url: "/library",
        },
        {
          title: "Utilisateurs",
          url: "/users",
        },
      ],
    };
  },
};
</script>

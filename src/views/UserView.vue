<template>
  <p>User : {{ userId }}</p>
</template>

<script>
import * as UsersService from "../services/UsersService";

export default {
  data() {
    return {
      userId: null,
      userData: null,
    };
  },

  mounted() {
    this.userId = this.$route.params.id;
    this.getUser();
  },

  methods: {
    async getUser() {
      try {
        this.userData = await UsersService.get(`?userId=${this.userId}`);
        this.userData = this.userData.results[0];
        console.log(this.userData);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

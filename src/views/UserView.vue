<template>
  <div>
    <user-card
      :userData="userData"
      context="userView"
      class="mt-2"
      v-if="userData"
    ></user-card>
  </div>
</template>

<script>
import * as UsersService from "../services/UsersService";
import UserCard from "../components/UserCard.vue";

export default {
  data() {
    return {
      userId: null,
      userData: null,
    };
  },

  components: {
    UserCard,
  },

  created() {
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

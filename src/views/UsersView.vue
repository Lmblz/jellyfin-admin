<template>
  <v-sheet class="mx-auto my-2 w-100">
    <v-form
      validate-on="submit lazy"
      @submit.prevent="
        {
          search.length > 0 ? searchUser() : '';
        }
      "
    >
      <v-text-field
        v-model="search"
        :rules="rules"
        label="Search for a user"
      ></v-text-field>

      <v-btn
        :loading="isLoading"
        type="submit"
        block
        class="mt-2"
        text="Search"
      ></v-btn>
    </v-form>
  </v-sheet>
  <v-row v-if="result && users.length > 0">
    <v-col cols="12">
      <h2>{{ users.length }} results</h2>
    </v-col>
    <v-col
      v-for="(user, index) in users"
      :key="user.id"
      xxl="1"
      lg="2"
      md="3"
      cols="4"
    >
      <user-card
        :userId="user.id"
        :userName="user.name"
        :hasPicture="user.hasPicture"
        :lastSeen="user.lastLoginDate"
        :lastActivity="user.lastActivityDate"
        :isAdmin="user.isAdministrator"
      ></user-card>
    </v-col>
  </v-row>
</template>
<script>
import * as UsersService from "../services/UsersService";
import UserCard from "@/components/UserCard.vue";

export default {
  data() {
    return {
      result: null,
      users: null,
      nbResults: 25,
      isLoading: false,
      search: "",
      timeout: null,
      rules: [
        (value) => {
          if (value) return true;
          return "This field can not be empty";
        },
      ],
    };
  },

  components: {
    UserCard,
  },

  methods: {
    async getUsers(param) {
      try {
        this.result = await UsersService.get(param);
        this.users = this.result.results;
        console.log(this.users);
      } catch (e) {
        console.error(e);
      }
    },

    async searchUser(event) {
      this.isLoading = true;
      await this.getUsers("?userName=" + this.search + "&nb=" + this.nbResults);
      // Uncomment if want to sort users by alphabetical order
      //this.sortUsersByName();
      this.isLoading = false;
    },

    sortUsersByName() {
      this.users.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        return 1;
      });
    },
  },
};
</script>

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
      <h2>{{ users.length }} result<slot v-if="users.length > 1">s</slot></h2>
    </v-col>
    <v-col
      v-for="(user, index) in users"
      :key="user.id"
      xxl="2"
      lg="3"
      md="4"
      cols="6"
    >
      <!-- <p>{{ user }}</p> -->
      <user-card :userData="user" context="usersSearch"></user-card>
    </v-col>
  </v-row>
  <v-row v-else>
    <v-col cols="12">
      <h2>Total users : {{ totalUsers }}</h2>
      <v-btn @click="getUsers('?nb=' + totalUsers)">Search all users</v-btn>
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
      totalUsers: 0,
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

  async mounted() {
    try {
      let response = await UsersService.get("?nb=0");
      this.totalUsers = response.count;
    } catch (e) {
      console.error(e);
    }
  },

  methods: {
    async getUsers(param) {
      this.isLoading = true;
      try {
        this.result = await UsersService.get(param);
        this.users = this.result.results;
      } catch (e) {
        console.error(e);
      }
      this.isLoading = false;
    },

    async searchUser(event) {
      await this.getUsers("?userName=" + this.search + "&nb=" + this.nbResults);
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

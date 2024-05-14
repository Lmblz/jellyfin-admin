<template>
  <users-table @errorEvent="showError"></users-table>
  <v-snackbar
    v-model="hasError"
    title="Error"
    location="top right"
    variant="flat"
    color="error"
  >
    <h3>Error - {{ errorContext }}</h3>
    <p>{{ errorMessage }}</p>
    <template v-slot:actions>
      <v-btn icon="mdi-close" @click="hasError = false"> </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import * as UsersService from "../services/UsersService";
import UserCard from "@/components/UserCard.vue";
import UsersTable from "@/components/UsersTable.vue";

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
      hasError: false,
      errorMessage: null,
      errorContext: null,
    };
  },

  components: {
    UserCard,
    UsersTable,
  },

  async mounted() {
    try {
      let response = await UsersService.get("?nb=0");
      this.totalUsers = response.count;
    } catch (e) {
      console.error(e);
      this.showError("errorEvent", { context: "Users", message: e.message });
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
        this.showError("errorEvent", { context: "Users", message: e.message });
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

    showError({ context, message }) {
      this.errorMessage = message;
      this.errorContext = context;
      this.hasError = true;
    },
  },
};
</script>

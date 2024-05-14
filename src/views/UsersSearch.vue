<template>
  <users-table></users-table>
</template>

<script>
import * as UsersService from "../services/UsersService";
import UserCard from "@/components/UserCard.vue";
import UsersTable from "@/components/UsersTable.vue";
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

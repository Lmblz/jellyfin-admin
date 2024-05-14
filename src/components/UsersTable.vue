<template>
  <v-card flat class="mt-2">
    <v-card-title class="d-flex align-center">
      <p class="mr-4">Users</p>
      <v-spacer></v-spacer>
      <v-form
        validate-on="submit lazy"
        class="w-75"
        @submit.prevent="searchUser()"
      >
        <v-text-field
          class="w-100"
          v-model="search"
          prepend-inner-icon="mdi-account"
          append-inner-icon="mdi-magnify"
          label="Search for a user"
          variant="outlined"
          clearable
          density="compact"
          @click:append-inner="searchUser()"
        ></v-text-field>
      </v-form>
    </v-card-title>
    <v-data-table-server
      density="comfortable"
      :hover="true"
      fixed-header
      :headers="headers"
      :items="usersSearched"
      :items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      :items-length="totalItems"
      :loading="isLoading"
      @update:items-per-page="itemsPerPage = $event"
      @update:options="sortPagination($event)"
    >
      <template v-slot:item.name="{ item }">
        <RouterLink
          :to="`/users/${item.id}`"
          style="text-decoration: none; color: inherit"
        >
          <v-row class="align-center">
            <v-avatar
              color="primary"
              size="small"
              class="user-avatar__image mr-2"
              :class="item.hasPicture ? '-has-picture' : ''"
            >
              <slot v-if="item.hasPicture">
                <img
                  :src="
                    'https://j.nimi.ovh/users/' + item.id + '/Images/Primary'
                  "
                />
              </slot>
              <b v-else>
                {{ item.name.split("")[0].toUpperCase() }}
              </b>
            </v-avatar>
            <p>
              {{ item.name }}
              <span
                v-if="item.isAdministrator"
                class="text-caption text-disabled"
              >
                - admin</span
              >
            </p>
          </v-row>
        </RouterLink>
      </template>

      <template v-slot:item.lastActivityDate="{ item }">
        {{ formatDate(item.lastActivityDate) }}
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import * as UsersService from "../services/UsersService";

export default {
  data() {
    return {
      isLoading: false,
      itemsPerPage: 25,
      itemsPerPageOptions: [10, 25, 50, 100],
      totalItems: 0,
      totalUsers: 0,
      isHistoryLoading: false,
      users: [],
      usersSearched: [],
      search: "",
      headers: [
        {
          title: "User",
          key: "name",
          sortable: false,
        },
        {
          title: "Total watch",
          key: "totalWatch",
          sortable: false,
        },
        {
          title: "Last activity",
          key: "lastActivityDate",
          sortable: false,
        },
        {
          title: "Last seen",
          key: "lastWatch.title",
          sortable: false,
        },
      ],
    };
  },

  async mounted() {
    try {
      let response = await UsersService.get("?nb=0");
      this.totalUsers = response.count;
    } catch (e) {
      console.error(e);
    }

    this.getUsers(`?start=0&nb=${this.itemsPerPage}`);
  },

  methods: {
    async getUsers(param) {
      this.isLoading = true;
      try {
        console.log(this.itemsPerPage);
        this.result = await UsersService.get(param);
        this.users = this.result.results;
        this.totalItems = this.result.count;
        this.usersSearched = this.users;
      } catch (e) {
        console.error(e);
      }
      this.isLoading = false;
    },

    sortPagination(event) {
      let params = `?start=${(event.page - 1) * this.itemsPerPage}&nb=${
        this.itemsPerPage
      }`;
      if (this.search !== null && this.search !== "")
        params += `&userName=${this.search}`;
      this.getUsers(params);
    },

    formatDate(date) {
      let _date = date.split("T")[0];
      let dateSplit = _date.split("-");
      let response = `${dateSplit[2]}/${dateSplit[1]}/${dateSplit[0]}`;
      return response;
    },

    searchUser() {
      let params = `?start=0&nb=${this.itemsPerPage}&nb=${this.itemsPerPage}`;
      if (this.search !== null && this.search !== "")
        params += `&userName=${this.search}`;
      this.getUsers(params);
    },
  },
};
</script>

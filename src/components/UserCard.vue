<template>
  <v-card
    elevation="12"
    rounded="lg"
    class="mx-auto"
    variant="tonal"
    :subtitle="userName + (isAdmin ? ' - Admin' : '')"
  >
    <template v-slot:prepend>
      <v-avatar color="primary" size="small">
        <slot v-if="hasPicture">
          <v-img cover :src="getUserPicture(userId)" />
        </slot>
        <b v-else>
          {{ userName.split("")[0].toUpperCase() }}
        </b>
      </v-avatar>
    </template>
    <v-card-text>
      <p class="text-caption">Last seen : {{ formatDate(lastSeen) }}</p>
      <p class="text-caption">
        Last activity : {{ formatDate(lastSeen) }}
      </p></v-card-text
    >
  </v-card>
</template>

<script>
export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    hasPicture: {
      type: Boolean,
    },
    lastSeen: {
      type: String,
      required: true,
    },
    lastActivity: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
    },
  },

  methods: {
    getUserPicture(id) {
      return `https://j.nimi.ovh/users/${id}/Images/Primary`;
    },
    formatDate(date) {
      if (date !== "0001-01-01T00:00:00") {
        let dateWithoutSec = date.substring(0, date.length - 11);
        let splittedDate = dateWithoutSec.split("T");
        let dateArr = splittedDate[0].split("-");
        return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]} ${splittedDate[1]}`;
      }

      return "Never";
    },
  },
};
</script>

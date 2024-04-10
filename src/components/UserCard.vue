<template>
  <component
    :is="cardRootNode"
    v-bind="linkProps"
    style="text-decoration: none; color: inherit"
  >
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-card
          v-bind="props"
          :class="{ '-hover': isHovering }"
          elevation="12"
          rounded="lg"
          class="mx-auto"
          variant="tonal"
          :subtitle="
            context !== 'usersSearch'
              ? userData.id
              : userData.name +
                (userData.isAdministrator ? ' - Admin' : '') +
                (context !== 'usersSearch' ? ' - ' + userData.id : '')
          "
          :title="context !== 'usersSearch' ? userData.name : ''"
        >
          <template v-slot:prepend>
            <v-avatar
              :color="!userData.hasPicture ? 'primary' : ''"
              size="small"
            >
              <slot v-if="userData.hasPicture">
                <v-img cover :src="getUserPicture(userData.id)" />
              </slot>
              <b v-else>
                {{ userData.name.split("")[0].toUpperCase() }}
              </b>
            </v-avatar>
          </template>
          <v-card-text>
            <p :class="context !== 'usersSearch' ? '' : 'text-caption'">
              Total watch : {{ userData.totalWatch }}
            </p>
            <p :class="context !== 'usersSearch' ? '' : 'text-caption'">
              Last activity : {{ formatDate(userData.lastActivityDate) }}
              {{
                userData.lastWatch && context !== "usersSearch"
                  ? ": " + userData.lastWatch.title
                  : ""
              }}
            </p>
            <p :class="context !== 'usersSearch' ? '' : 'text-caption'">
              Last seen : {{ formatDate(userData.lastLoginDate) }}
            </p>
          </v-card-text>
        </v-card></template
      >
    </v-hover>
  </component>
</template>

<script>
export default {
  props: {
    userData: {
      required: true,
    },
    context: {
      type: String,
    },
  },

  mounted() {
    console.log(this.$props.userData);
  },

  methods: {
    getUserPicture(id) {
      return `https://j.nimi.ovh/users/${id}/Images/Primary`;
    },
    formatDate(date) {
      if (date !== "0001-01-01T00:00:00" && date != undefined && date != "") {
        let dateWithoutSec = date.substring(0, date.length - 11);
        let splittedDate = dateWithoutSec.split("T");
        let dateArr = splittedDate[0].split("-");
        return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]} ${splittedDate[1]}`;
      }

      return "Never";
    },
  },

  computed: {
    cardRootNode() {
      return this.context === "usersSearch" ? "router-link" : "div";
    },
    linkProps() {
      if (this.context === "usersSearch") {
        return {
          to: `/users/${this.userData.id}`,
        };
      } else {
        return {};
      }
    },
  },
};
</script>

<style lang="scss">
.-hover {
  opacity: 0.8;
}
</style>

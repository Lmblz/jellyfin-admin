<template>
  <v-sheet
    elevation="12"
    max-width="400"
    rounded="lg"
    width="100%"
    class="pa-4 text-center"
  >
    {{ id }}
  </v-sheet>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "0",
    },
  },
};
</script>

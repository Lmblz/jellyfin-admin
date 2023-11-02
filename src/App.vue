<template>
  <router-view />
</template>

<script>
import * as NowService from "./services/NowService.js";
export default {
  data() {
    return {
      now: {},
    };
  },

  async created() {
    try {
      this.now = await NowService.getAll();
    } catch (e) {
      console.log(e);
    }
    console.log(this.now);
  },
};
</script>

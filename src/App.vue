<template>
  <div id="app">
    <Sidebar />
    <div class="main-content">
      <router-view /> <!-- Router outlet for the current route -->
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";

export default {
  name: "App",
  components: {
    Sidebar,
  },
};
</script>

<style scoped>
/*
#app {
}
*/
.main-content {
  margin-left: min(20%, 200px); /* Matches Sidebar width */
  padding-inline: 2rem; /* Adds some padding from edges of screen */
  min-height: 100vh;
}
</style>

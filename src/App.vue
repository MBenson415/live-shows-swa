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
import "./App.css";
export default {
  name: "App",
  components: {
    Sidebar,
  },
};
</script>

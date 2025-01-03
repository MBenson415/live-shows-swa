<template>
  <div id="app">
    <Sidebar />
    <div class="main-content">
      <router-view /> <!-- Router outlet for the current route -->
    </div>
    <GoogleMap />
  </div>
</template>

<script>
import "./App.css";
import Sidebar from "@/components/Sidebar.vue";
import GoogleMap from "./components/GoogleMap.vue";
export default {
  name: "App",
  components: {
    Sidebar,
    GoogleMap
  },
};
</script>

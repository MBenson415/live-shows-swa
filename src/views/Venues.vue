<template>
  <div>

    <div class="venues-container">
      <div class="venues-main-content">
        <h1>Venue Management</h1>
        <GoogleMap />

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import "./Venues.css";
import GoogleMap from "../components/GoogleMap.vue";


export default {
  components: {
    GoogleMap
  },
  name: "Venues",

};
</script>

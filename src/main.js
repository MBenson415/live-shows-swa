import Vue from "vue";
import App from "./App.vue";
import router from "@/router"; // Import the router
import "./assets/style.css";
import "./assets/colors.css"; // Global colors from palette
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
        key: 'AIzaSyB1f5M4esX6NqhJcrZ5AtZ1dHzzG-6vBSg',
        libraries: 'places',
      }
    });

Vue.config.productionTip = false;

// Create Vue instance
new Vue({
  router, // Use the router instance
  render: (h) => h(App),
}).$mount("#app");
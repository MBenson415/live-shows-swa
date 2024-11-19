import Vue from "vue";
import App from "./App.vue";
import router from "@/router"; // Import the router
import "./assets/style.css";

Vue.config.productionTip = false;

// Create Vue instance
new Vue({
  router, // Use the router instance
  render: (h) => h(App),
}).$mount("#app");

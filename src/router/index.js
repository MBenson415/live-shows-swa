import Vue from "vue";
import VueRouter from "vue-router";
import Page1 from "@/views/Page1.vue";
import Page2 from "@/views/Page2.vue";
import Page3 from "@/views/Page3.vue";

// Install Vue Router
Vue.use(VueRouter);

// Define routes
const routes = [
  { path: "/", redirect: "/page1" }, // Redirect root to Page1
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
];

// Create the router instance
const router = new VueRouter({
  mode: "history", // Use history mode for clean URLs
  routes,
});

export default router;
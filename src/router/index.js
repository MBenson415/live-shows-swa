import Vue from "vue";
import VueRouter from "vue-router";
const Page1 = () => import(/* webpackChunkName: "page1" */ "@/views/Page1.vue");
const Page2 = () => import(/* webpackChunkName: "page2" */ "@/views/Page2.vue");
const Page3 = () => import(/* webpackChunkName: "page3" */ "@/views/Page3.vue");
const Bands = () => import(/* webpackChunkName: "bands" */ "@/views/Bands.vue");
const Venues = () => import(/* webpackChunkName: "venues" */ "@/views/Venues.vue");
const Events = () => import(/* webpackChunkName: "events" */ "@/views/Events.vue");


// Install Vue Router
Vue.use(VueRouter);

// Define routes
const routes = [
  { path: "/", redirect: "/events" }, // Redirect root to events
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
  { path: "/bands", component: Bands },
  { path: "/venues", component: Venues },
  { path: "/events", component: Events },
];

// Create the router instance
const router = new VueRouter({
  mode: "history", // Use history mode for clean URLs
  routes,
});


export default router;

import { createRouter, createWebHistory } from "vue-router";
import Page1 from "@/views/Page1.vue";
import Page2 from "@/views/Page2.vue";
import Page3 from "@/views/Page3.vue";

const routes = [
  { path: "/page1", component: Page1 },
  { path: "/page2", component: Page2 },
  { path: "/page3", component: Page3 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

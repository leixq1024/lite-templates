import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
Vue.use(VueRouter);
const routes: Array<RouteConfig> = [
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/about/about.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

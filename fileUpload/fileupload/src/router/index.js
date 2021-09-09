import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    redirect: "/fileupload",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue"),
  },
  {
    path: "/fileupload",
    name: "fileupload",
    component: () =>
      import(/* webpackChunkName: "Home" */ "../views/fileupload.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;

import Vue from "vue";
import VueRouter from "vue-router";
import API from '@/services/index'
import Home from "../pages/home.vue";
import Login from "../pages/login.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});
// mount router navgitar
router.beforeEach(async(to, from, next) => {
  if (to.path === "/login") return next();
  const token = window.localStorage.getItem("token");
  const res = await API.checkAuth({ token })
  // console
  if (!res.data) return next("/login");
  next();
});
export default router;

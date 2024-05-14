// Composables
import { createRouter, createWebHashHistory } from "vue-router";

import HomePage from "../views/HomePage.vue";
import Libraries from "../views/LibrariesView.vue";
import LibrariesList from "../views/LibrariesList.vue";
import Library from "../views/LibraryView.vue";
import Users from "../views/UsersView.vue";
import UsersSearch from "../views/UsersSearch.vue";
import User from "../views/UserView.vue";
import History from "../views/HistoryView.vue";
import Media from "../views/MediaView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    alias: "/home",
    component: HomePage,
    children: [
      {
        path: "",
        name: "Home",
        component: HomePage,
      },
    ],
  },
  {
    path: "/libraries",
    name: "Libraries",
    alias: "/libraries",
    component: Libraries,
    children: [
      {
        name: "LibrariesList",
        path: "",
        component: LibrariesList,
      },
      {
        name: "Library",
        path: ":id",
        component: Library,
      },
    ],
  },
  {
    path: "/users",
    name: "Users",
    alias: "/users",
    component: Users,
    children: [
      {
        name: "Search",
        path: "",
        component: UsersSearch,
      },
      {
        name: "User",
        path: ":id",
        component: User,
      },
    ],
  },
  {
    path: "/history",
    name: "History",
    alias: "/history",
    component: History,
  },
  {
    path: "/media",
    redirect: "/",
  },
  {
    path: "/media/:id",
    name: "Media",
    alias: "/media/:id",
    component: Media,
    beforeEnter: (to, from, next) => {
      const id = parseInt(to.params.id);
      isNaN(id) ? next("/") : next();
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
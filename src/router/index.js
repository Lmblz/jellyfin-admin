// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from "../views/HomePage.vue";
const Libraries = () => import("../views/LibrariesView.vue");
const LibrariesList = () => import("../views/LibrariesList.vue");
const Library = () => import("../views/LibraryView.vue");
const Users = () => import("../views/UsersView.vue");
const History = () => import("../views/HistoryView.vue");
const UsersSearch = () => import('../views/UsersSearch.vue');
const User = () => import("../views/UserView.vue");
const Media = () => import("../views/MediaView.vue");

const routes = [
  {
    path: '/',
    name: 'Home',
    alias: '/home',
    component: HomePage,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomePage,
      },
    ],
  },
  {
    path: "/libraries",
    name: "Libraries",
    alias: '/libraries',
    component: Libraries,
    children: [
      {
        name: 'LibrariesList',
        path: '',
        component: LibrariesList,
      },
      {
        name: "Library",
        path: ":id",
        component: Library
      }
    ]
  },
  {
    path: '/users',
    name: 'Users',
    alias: '/users',
    component: Users,
    children: [
      {
        name: 'Search',
        path: '',
        component: UsersSearch
      },
      {
        name: 'User',
        path: ':id',
        component: User,
      }
    ]
  },
  {
    path: '/history',
    name: 'History',
    alias: '/history',
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
      isNaN(id)
        ? next("/")
        : next();
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router

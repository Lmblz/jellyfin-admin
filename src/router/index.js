// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

import HomePage from "../views/HomePage.vue";
const Library = () => import("../views/LibraryView.vue");
const Users = () => import("../views/UsersView.vue");
const History = () => import("../views/HistoryView.vue");
const UsersSearch = () => import('../views/UsersSearch.vue');
const User = () => import("../views/UserView.vue");

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
    path: "/library",
    name: "Library",
    alias: '/library',
    component: Library,
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
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router

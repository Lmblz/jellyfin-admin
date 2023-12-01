// Composables
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from "../views/HomePage.vue";
const Library = () => import("../views/LibraryView.vue");
const Users = () => ("../views/UsersView.vue");

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

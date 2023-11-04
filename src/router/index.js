// Composables
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from "../views/HomePage.vue";
import Library from "../views/LibraryView.vue";
import Users from "../views/UsersView.vue";

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
        component: () => import('@/views/HomePage.vue'),
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

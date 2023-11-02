// Composables
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from "../views/HomePage.vue";

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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

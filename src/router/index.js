import { createRouter, createWebHistory } from 'vue-router'
import ForeCast from '@/views/ForecastView.vue'
import LocationsView from '@/views/LocationsView.vue'
import ForecastView from '@/views/ForecastView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ForeCast,
    },
    {
      path: '/locations',
      name: 'locations',
      component: LocationsView,
    },
    {
      path: '/forecast/:location',
      name: 'forecast',
      component: ForecastView,
      props: true,
    },
    {
      path: "/:catchAll(.*)",
      component: () => import('../views/NoShow.vue'),
      meta: {
        title: "404",
      },
    },
  ],
})

export default router
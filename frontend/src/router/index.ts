import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import DynastyDetail from '../views/DynastyDetail.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/dynasty/:id', name: 'dynasty', component: DynastyDetail, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

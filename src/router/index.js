import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import admin from "../views/Admin.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    //  述职次序
    path: '/szcx',
    name: 'Home',
    component: Home
  },
  {
    path: '/Admin',
    name: 'admin',
    component: admin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

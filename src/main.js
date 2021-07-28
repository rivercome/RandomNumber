import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import VueRouter from 'vue-router'
import router from './router'
import axios from 'axios'
import api from "./api/api"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import less from 'less'
Vue.use(less)

Vue.prototype.$axios = axios
Vue.prototype.$api = api
Vue.use(ElementUI);
Vue.use(VueRouter)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

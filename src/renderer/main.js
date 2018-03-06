/* eslint-disable no-unused-vars */
import $ from 'jquery'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import VueCodemirror from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'

Vue.use(VueCodemirror, /* { 
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.Events = Vue.prototype.$events = new Vue({});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

/* eslint-disable no-unused-vars */
import $ from 'jquery'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { ipcRenderer } from 'electron'

// import VueCodemirror from 'vue-codemirror'

// // require styles
// import 'codemirror/lib/codemirror.css'


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
const events = Vue.Events = Vue.prototype.$events = new Vue({});
Vue.Store = Vue.prototype.$store = store;

ipcRenderer.on('action', (evt, action) => {
  Vue.Events.$emit(action)
})

Vue.prototype.$copyToClipboard = (text, rmpl = false) => {
  if(rmpl) try { text = text.toString().replace(/^\+?86/g, '').replace(/^\+?7/g, '') } catch (err) {}

  let textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.padding = textArea.style.left = textArea.style.top = 0;
  textArea.style.height = textArea.style.width = '2em';
  textArea.style.boxShadow = textArea.style.outline = textArea.style.border = 'none';
  textArea.style.background = 'transparent';

  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
      let successful = document.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
  } catch (err) {
      console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
};


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
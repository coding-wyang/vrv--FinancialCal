import Vue from 'vue';
import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';
import './plugins/element.js';
import 'element-ui/lib/theme-chalk/index.css';

new Vue({
  router,
  store,
  render(h) { return h(App); }
}).$mount('#app');

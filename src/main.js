// import { createApp } from 'vue';
import Vue from 'vue';
import router from '@/router/index';
import App from './App.vue';
import store from './store/index';

Vue.config.productionTip = false;

// createApp(App).mount('#app');
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

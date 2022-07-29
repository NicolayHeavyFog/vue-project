// import { createApp } from 'vue';
import Vue from 'vue';
import App from './App.vue';

// import { message, timeStamp, str } from './data';
// import alrt from './function';

Vue.config.productionTip = false;

// createApp(App).mount('#app');
new Vue({
  render: (h) => h(App),
}).$mount('#app');
// alrt(message, timeStamp, str);/

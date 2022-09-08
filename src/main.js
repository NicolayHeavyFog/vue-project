import { createApp, h } from 'vue';
import router from '@/router/index';
import App from './App.vue';
import store from './store/index';

// createApp(App).mount('#app');
const app = createApp({
  render: () => h(App),
});

app.use(router);
app.use(store);
app.mount('#app');

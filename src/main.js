import { createApp } from 'vue';
import App from './App.vue';

import { message, timeStamp, str } from './data';
import alrt from './function';

createApp(App).mount('#app');
alrt(message, timeStamp, str);

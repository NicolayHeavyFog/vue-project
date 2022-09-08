import { createRouter, createWebHashHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import CartProduct from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import config from '../../vue.config';

const routes = [
  {
    name: 'main',
    component: MainPage,
    path: '/',
    // beforeEnter(to, from) {
    //   console.log(to, from);
    // },
  },
  { name: 'product', component: ProductPage, path: '/product/:id' },
  { name: 'cart', component: CartProduct, path: '/cart' },
  { name: 'order', component: OrderPage, path: '/order' },
  { name: 'orderInfo', component: OrderInfoPage, path: '/order/:id' },
  { name: 'notFound', component: NotFoundPage, path: '/:pathMatch(.*)*' },
];

const router = createRouter({
  history: createWebHashHistory(config.publicPath),
  routes,
});
export default router;

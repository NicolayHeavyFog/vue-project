import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    cartLoading: true,
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((currentItem) => currentItem.productId === productId);
      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    // addProduct(state, productId) {
    //   const item = state.cartProducts.find((currentItem) => currentItem.productId === productId);
    //   if (item) item.amount += 1;
    // },
    // removeProduct(state, productId) {
    //   const item = state.cartProducts.find((currentItem) => currentItem.productId === productId);
    //   if (item) {
    //     if (item.amount === 1) this.commit('deleteCartProduct', productId);
    //     else item.amount -= 1;
    //   }
    // },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
      }));
    },
    changeStatusCartLoading(state, value) {
      state.cartLoading = value;
    },
  },
  getters: {
    cartDetailProduct(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);
        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProduct.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    cartTotalTypeProduct(state, getters) {
      return getters.cartDetailProduct.length;
    },
    orderInfo(state) {
      return state.orderInfo;
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        params: {
          userAccessKey: context.state.userAccessKey,

        },
      }).then((response) => {
        context.commit('updateOrderInfo', response.data);
      });
    },
    loadCart(context) {
      let response;
      context.commit('changeStatusCartLoading', true);
      setTimeout(() => {
        response = axios.get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
          .then((r) => {
            if (!context.state.userAccessKey) {
              localStorage.setItem('userAccessKey', r.data.user.accessKey);
              context.commit('updateUserAccessKey', r.data.user.accessKey);
            }

            context.commit('updateCartProductData', r.data.items);
            context.commit('syncCartProducts');
          }).then(() => {
            context.commit('changeStatusCartLoading', false);
          });
      }, 5000);
      return response;
    },
    addProductToCart(context, { productId, amount }) {
      // eslint-disable-next-line no-promise-executor-return
      return (new Promise((resolve) => setTimeout(resolve, 2000)))
        .then(() => axios.post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        }).then((response) => {
          console.log('addProductToCart');
          context.commit('updateCartProductData', response.data.items);
          context.commit('syncCartProducts');
        }));
    },
    updateCartProductAmount(context, { productId, amount }) {
      if (amount < 1) { return 0; }
      context.commit('updateCartProductAmount', { productId, amount });

      return axios.put(`${API_BASE_URL}/api/baskets/products`, {
        productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      }).then((response) => {
        context.commit('updateCartProductData', response.data.items);
      }).catch(() => {
        context.commit('syncCartProducts');
      });
    },
    async deleteProduct(context, productId) {
      console.log(productId);
      console.log(context.state.userAccessKey);

      context.commit('deleteCartProduct', productId);
      // await response.json()
      await fetch(`${API_BASE_URL}/api/baskets/products?userAccessKey=${context.state.userAccessKey}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ productId }),
      }).then((r) => {
        r.json().then((response) => {
          console.log(response);
          context.commit('updateCartProductData', response.items);
        });
      }).catch(() => {
        console.log('sync');
        context.commit('syncCartProducts');
      });

    //   return axios.delete(`${API_BASE_URL}/api/baskets/products`, {
    //     productId,
    //   }, {
    //     params: {
    //       userAccessKey: context.state.userAccessKey,
    //     },
    //   }).then((response) => {
    //     console.log(response);
    //     context.commit('updateCartProductData', response.data.items);
    //   }).catch((response) => {
    //     console.log(response);
    //     context.commit('syncCartProducts');
    //   });
    },
  },

});

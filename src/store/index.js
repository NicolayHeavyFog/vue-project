import Vue from 'vue';
import Vuex from 'vuex';
import products from '@/data/products';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [
      { productId: 1, amount: 2 },
    ],
  },
  mutations: {
    addProductToCart(state, { productId, amount }) {
      const item = state.cartProducts.find((currentItem) => currentItem.productId === productId);
      if (item) {
        item.amount += amount;
      } else {
        state.cartProducts.push({
          productId,
          amount,
        });
      }
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
    addProduct(state, productId) {
      const item = state.cartProducts.find((currentItem) => currentItem.productId === productId);
      if (item) item.amount += 1;
    },
    removeProduct(state, productId) {
      const item = state.cartProducts.find((currentItem) => currentItem.productId === productId);
      if (item) {
        if (item.amount === 1) this.commit('deleteCartProduct', productId);
        else item.amount -= 1;
      }
    },
  },
  getters: {
    cartDetailProduct(state) {
      return state.cartProducts.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.productId),
      }));
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProduct.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    cartTotalTypeProduct(state, getters) {
      return getters.cartDetailProduct.length;
    },
  },
});

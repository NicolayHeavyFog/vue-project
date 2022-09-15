import { createStore } from "vuex";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export default createStore({
  state: {
    userAccessKey: null,
    cartProductsData: [],
    cartLoading: true,
    cartUpdateItem: [],
    cartError: {
      textError: null,
      status: false,
    },
    orderInfo: null,
    colors: [],
    chosenOffers: [],
  },
  mutations: {
    // App --------------------------------------------------------------

    // initialization
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },

    // switch status
    changeStatusCartLoading(state, value) {
      state.cartLoading = value;
    },

    changeErrorCartLoading(state, value) {
      state.cartError.textError = value.textError;
      state.cartError.status = value.status;
    },

    changeStatusCartItem(state, value) {
      const item = state.cartUpdateItem.find((i) => i.offerCartId === value.offerCartId);
      if (value.status) {
        if (item) item.status = value.status;
        else {
          state.cartUpdateItem.push({
            offerCartId: value.offerCartId,
            status: value.status,
          });
        }
      } else {
        // const item = state.cartUpdateItem.find((i) => i.offerCartId === value.offerCartId);
        item.status = false;
        // state.cartUpdateItem.offerCartId.findIndex((cartItem) => cartItem === value.offerCartId) = null;
      }
    },

    // MainPage ----------------------------------------------------------

    // ProductColor ------------------------------------------------------

    addChosenOffers(state, value) {
      // console.log(value);
      let result = [];
      result = state.chosenOffers.filter((product) => product.productId !== value.productId);
      result.push({
        productId: value.productId,
        offer: value.offer,
      });
      state.chosenOffers = result;
    },

    addColors(state, value) {
      state.colors = value;
    },

    //  ------------------------------------------------------

    // initialization
    // items - ответ с сервера для товаров в корзине
    updateCartProductData(state, items) {
      console.log(items);
      state.cartProductsData = items.map((item) => ({
        color: item.color.color,
        productPrice: item.price,
        offerPrice: item.productOffer.price,
        amount: item.quantity,
        productId: item.productOffer.product.id,
        offerCartId: item.id,
        offerId: item.productOffer.id,
        image: item.productOffer.product.preview.file.url,
        offerTitle: item.productOffer.title,
        productProp: item.productOffer.propValues,
      }));
    },

    // CartPage ----------------------------------------------------------
    // Манипулирую объектом в ЛОКАЛЬНОМ хранилище
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProductsData.find(
        (currentItem) => currentItem.productId === productId
      );
      if (item) {
        item.amount = amount;
      }
    },

    // OrderPage ----------------------------------------------------------
    resetCart(state) {
      state.cartProductsData = [];
    },

    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
  },
  getters: {
    // ProductColor ------------------------------------------------------

    colors(state) {
      if (!state.colors) return [];
      return state.colors;
    },

    // Product Property

    chosenOffers(state) {
      return state.chosenOffers;
    },

    // CartPage ----------------------------------------------------------

    cartProductsData(state) {
      // console.log(state.cartProductsData);
      return state.cartProductsData;
    },

    cartTotalAmount(state, getters) {
      return getters.cartProductsData.reduce((acc, item) => item.amount + acc, 0);
    },

    cartTotalPrice(state, getters) {
      return getters.cartProductsData.reduce(
        (acc, item) => item.productPrice * item.amount + acc,
        0
      );
    },

    cartStatusError(state) {
      return state.cartError;
    },

    cartItemLoading(state) {
      return state.cartUpdateItem;
    },

    cartLoading(state) {
      return state.cartLoading;
    },

    // OrderInfo ----------------------------------------------------------

    orderInfo(state) {
      return state.orderInfo;
    },
  },
  actions: {
    // initialization
    loadCart(context) {
      context.commit("changeStatusCartLoading", true);
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((r) => {
          console.log(context.state.userAccessKey);
          if (!context.state.userAccessKey) {
            localStorage.setItem("userAccessKey", r.data.user.accessKey);
            context.commit("updateUserAccessKey", r.data.user.accessKey);
          }
          context.commit("updateCartProductData", r.data.items);
          // context.commit('syncCartProducts');
        })
        .then(() => {
          context.commit("changeStatusCartLoading", false);
        });
    },

    loadColors(context) {
      return axios.get(`${API_BASE_URL}/api/colors`).then((response) => {
        context.commit("addColors", response.data.items);
      });
    },

    // ProductPage ------------------------------------------------------------

    addProductToCart(context, { productId, chosenColor, amount }) {
      // eslint-disable-next-line no-promise-executor-return
      return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
        axios
          .post(
            `${API_BASE_URL}/api/baskets/products`,
            {
              productOfferId: productId,
              colorId: chosenColor,
              quantity: amount,
            },
            {
              params: {
                userAccessKey: context.state.userAccessKey,
              },
            }
          )
          .then((response) => {
            context.commit("updateCartProductData", response.data.items);
            // context.commit('syncCartProducts');
          })
          .catch(() => {
            context.commit("changeErrorCartLoading", {
              textError: "Товарное предложение не найдено",
              status: true,
            });
          })
      );
    },

    // CartPage ------------------------------------------------------------

    updateCartProductAmount(context, { productId, amount }) {
      if (amount < 1) {
        return 0;
      }
      // context.commit('changeStatusCartLoading', true);

      context.commit("changeStatusCartItem", { status: true, offerCartId: productId });
      return axios
        .put(
          `${API_BASE_URL}/api/baskets/products`,
          {
            basketItemId: productId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          context.commit("updateCartProductData", response.data.items);
          context.commit("changeStatusCartItem", { status: false, offerCartId: productId });
        })
        .catch(() => {
          context.commit("changeStatusCartItem", { status: false, offerCartId: productId });
        });
    },

    async deleteProduct(context, offerCartId) {
      context.commit("changeStatusCartItem", { status: true, offerCartId });
      await fetch(
        `${API_BASE_URL}/api/baskets/products?userAccessKey=${context.state.userAccessKey}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({ basketItemId: offerCartId }),
        }
      )
        .then((r) => {
          r.json().then((response) => {
            context.commit("updateCartProductData", response.items);
          });
        })
        .catch(() => {
          context.commit("changeErrorCartLoading", {
            textError: true,
            status: "Что-то пошло не так...",
          });
        });
      context.commit("changeStatusCartItem", { status: false, offerCartId });
    },

    loadOrderInfo(context, orderId) {
      context.commit("changeStatusCartLoading", true);
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          console.log(response.data);
          context.commit("updateOrderInfo", response.data);
          context.commit("changeStatusCartLoading", false);
        });
    },
  },
});

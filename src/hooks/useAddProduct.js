import { reactive, ref } from 'vue';
import { useStore } from 'vuex';

// const $store = useStore();

export default function () {
  const isShowAddedMessage = ref(false);
  const status = reactive({
    added: false,
    addSending: false,
    error: false,
    text: null,
    field: null,
  });
  const productAmount = ref(1);
  const $store = useStore();
  const doAddToCart = (offer, chosenColorTitle) => {
    status.added = false;
    status.addSending = true;
    status.error = false;
    if (!chosenColorTitle || !offer) {
      setTimeout(() => {
        status.error = true;
        status.addSending = false;
        status.text = 'Укажите все параметры';
      }, 0);
    } else {
      const offerId = offer.id;
      const chosenColorId = $store.getters.colors.find((color) => color.title === chosenColorTitle).id;
      $store.dispatch('addProductToCart', { productId: offerId, chosenColor: chosenColorId, amount: productAmount.value })
        .then(() => {
          const response = $store.getters.cartStatusError;
          if (response.status) {
            status.error = true;
            status.addSending = false;
            status.text = response.textError;
            status.added = false;
          } else {
            isShowAddedMessage.value = true;
            status.added = true;
            status.addSending = false;
          }
        })
        .catch(() => {
          status.error = true;
          status.addSending = false;
        });
    }
  };

  return {
    doAddToCart, isShowAddedMessage, status, productAmount,
  };
}

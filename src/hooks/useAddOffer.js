import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default function useAddOffer(product) {
  const $store = useStore();
  const $route = useRoute();
  const currentProperty = ref(null);
  const currentColorOffer = ref(null);

  const chosenOffer = computed(() => $store.getters.chosenOffers.find((offer) => {
    if (offer.productId) return offer.productId === +$route.params.id;
    return null;
  }));

  const propTitle = computed(() => {
    if (product.value) return product.value.offers[0].propValues[0].productProp.title;
    return '';
  });

  const colorsOffer = computed(() => {
    if (product.value) {
      return product.value.colors.map((color) => ({
        offerProp: color.color.title,
        offerValue: {
          color: {
            code: color.color.code,
          },
        },
      }));
    }
    return [];
  });

  const currentOffer = computed(() => {
    if (currentProperty.value) {
      return product.value.offers.find(
        (offer) => offer.propValues[0].value === currentProperty.value,
      );
    }

    if (chosenOffer.value) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      currentProperty.value = chosenOffer.value.offer.propValues[0].value;
      return chosenOffer.value.offer;
    }
    return null;
  });

  const availableParams = computed(() => product.value.offers.map((offer) => ({
    offerProp: offer.propValues[0].value,
    offerValue: product.value.colors.find(
      (color) => color.color.title.replaceAll('ё', 'е') === offer.propValues[0].value,
    ),
  })));

  watch(
    currentOffer,
    () => {
      if (currentOffer.value) {
        $store.commit('addChosenOffers', {
          offer: currentOffer.value,
          productId: product.value.productId,
        });
      }
    },
    { deep: true },
  );

  return {
    currentProperty,
    currentColorOffer,
    currentOffer,
    propTitle,
    colorsOffer,
    availableParams,
  };
}

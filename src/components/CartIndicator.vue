<template>
  <div v-if="cartLoading === true">
    <BaseLoaderCircle class="lds-dual-ring__cart" />
  </div>
  <router-link
    v-else-if="cartLoading === false"
    class="header__cart"
    :to="{ name: 'cart' }"
    aria-label="Корзина с товарами"
  >
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">
      {{ $store.state.cartProductsData.length }}</span
    >
  </router-link>
</template>

<script>
import BaseLoaderCircle from '@/components/BaseLoaderCircle.vue';

export default {
  components: { BaseLoaderCircle },
  data() {
    return {};
  },
  computed: {
    cartLoading() {
      return this.$store.getters.cartLoading;
    },
  },
};
</script>

<style scoped>
.lds-dual-ring__cart {
  width: 40px;
  height: 30px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.lds-dual-ring__cart::after {
  width: 15px;
  height: 15px;
  border-color: #fff transparent #fff transparent;
}
</style>

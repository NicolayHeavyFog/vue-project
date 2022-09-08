<template>
  <li class="cart__item product" v-if="offerLoadingStatus">
    <BaseLoaderCircle class="cart__item--loading"/>
  </li>
  <li class="cart__item product" v-else-if="!offerLoadingStatus">
    <div class="product__pic">
      <img :src="offer.image" width="120" height="120" :alt="offer.offerTitle">
    </div>
    <h3 class="product__title">
      <router-link
        :to="{name: 'product', params: {id: offer.productId}}"
        style="color: #222;">
          {{offer.offerTitle}}
      </router-link>
    </h3>
    <span>{{offer.productProp[0].value}}</span>
    <div class="product__color">
      <span class="colors__title">Цвет:</span>
      <span class="colors__value" :style="color"></span>
    </div>
    <span class="product__code">
      Артикул: {{offer.offerId}}
    </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар" @click.prevent="removeProduct()">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count">

      <button type="button" aria-label="Добавить один товар"  @click.prevent="addProduct()">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{numberFormat(this.offer.amount * this.offer.offerPrice)}} ₽
    </b>

    <button class="product__del button-del"
    type="button"
    aria-label="Удалить товар из корзины"
    @click.prevent="deleteProduct(offer.offerCartId)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';
import BaseLoaderCircle from '@/components/BaseLoaderCircle.vue';
import validateObj from '@/helpers/validateObj';

export default {
  props: {
    offer: {
      required: true,
      validator: (value) => validateObj(value, ['color', 'productPrice', 'offerPrice', 'amount', 'productId', 'offerCartId', 'offerId', 'image', 'offerTitle', 'productProp']),
    },
  },
  components: { BaseLoaderCircle },
  computed: {
    color() {
      if (this.offer.color.code === '#ffffff') return 'background-color: #e9e9e9;';
      return `background-color: ${this.offer.color.code};`;
    },
    offerLoadingStatus() {
      const currentItem = this.$store.getters.cartItemLoading.find((cartItem) => cartItem.offerCartId === this.offer.offerCartId);
      if (currentItem) return currentItem.status;
      return null;
    },

    amount: {
      get() {
        return this.offer.amount;
      },
      set(value) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.updateCartProductAmount({ productId: this.offer.offerCartId, amount: value });
        }, 500);
      },
    },
  },
  methods: {
    numberFormat,
    ...mapActions({ updateCartProductAmount: 'updateCartProductAmount', deleteProduct: 'deleteProduct' }),

    addProduct() {
      this.updateCartProductAmount({ productId: this.offer.offerCartId, amount: this.offer.amount + 1 });
    },
    removeProduct() {
      this.updateCartProductAmount({ productId: this.offer.offerCartId, amount: this.offer.amount - 1 });
    },
  },
};
</script>

<style scoped>
.product__color {
  grid-column: 2/3;
  grid-row: 2/3;
  display: flex;
}

.colors__title {
  margin-right: 10px;
}

.cart__item--loading {
  grid-column: 1/6;
  grid-row: 1/4;
  min-height: 133px;
}

</style>

<template>
  <div class="cart__block">
    <div class="lds-dual-ring" v-if="cartLoading"></div>
    <ul class="cart__orders">
      <li class="cart__order" v-for="currentProduct in products" :key="currentProduct.productId">
        <h3>{{currentProduct.product.title}}</h3>
        <b>{{currentProduct.product.price | numberFormat}} ₽</b>
        <span>Артикул: {{currentProduct.product.id}}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>Доставка: <b>500 ₽</b></p>
      <p>Итого: <b>{{products.length}}</b> товара на сумму <b>{{totalPrice | numberFormat}} ₽</b></p>
    </div>

    <button class="cart__button button button--primery" type="submit" :disabled="!typeProductAmount">
      Оформить заказ
    </button>
  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {

  props: {
    totalPrice: {
      require: true,
      type: Number,
    },
    products: {
      require: true,
    },
  },
  filters: {
    numberFormat,
  },
  computed: {
    cartLoading() {
      return this.$store.state.cartLoading;
    },
    typeProductAmount() {
      return this.$store.getters.cartTotalTypeProduct;
    },
    //  typeProductAmount: 'cartTotalTypeProduct'
  },
};
</script>

<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>

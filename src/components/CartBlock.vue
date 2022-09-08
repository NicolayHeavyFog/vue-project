<template>
  <div class="cart__block">
    <BaseLoaderCircle v-if="cartLoading"/>
    <ul class="cart__orders">
      <li class="cart__order" v-for="currentOffer in offers" :key="currentOffer.offerId">
        <h3>{{currentOffer.offerTitle}}</h3>
        <b>{{numberFormat(currentOffer.offerPrice)}} ₽</b>
        <span class="cart__order-article">Артикул: {{currentOffer.offerId}}</span>
        <span class="cart__order-props">{{currentOffer.productProp[0].value}} & {{currentOffer.color.title}}</span>
        <span class="cart__order-amount">Количество товаров: {{currentOffer.amount}}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>Доставка: <b>{{Number(shipping) === 0 ? 'бесплатно' : `${numberFormat(Number(shipping))} ₽`}}</b></p>
      <p>Итого: <b>{{totalAmount}}</b> {{declensionWord(totalAmount)}} на сумму <b>{{numberFormat(totalPrice)}} ₽</b></p>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import BaseLoaderCircle from '@/components/BaseLoaderCircle.vue';
import { mapGetters } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import declensionWord from '@/helpers/declensionWord';

export default {
  components: { BaseLoaderCircle },
  props: {
    totalPrice: {
      required: true,
      type: Number,
    },
    offers: {
      required: true,
    },
    shipping: {
      required: true,
      type: [Number, String],
    },
  },
  computed: {
    ...mapGetters({
      cartLoading: 'cartLoading',
    }),
    totalAmount() {
      if (!this.offers) return 0;
      return this.offers.reduce(
        (previousValue, currentValue) => previousValue + currentValue.amount,
        0,
      );
    },
  },
  methods: {
    numberFormat,
    declensionWord,
  },

};
</script>

<style lang="scss" scoped>

.cart__order-props {
  grid-row: 3/4;
  color: #fff;
  font-size: 14px;
}

.cart__order-article {
  grid-row: 2/3;
}

.cart__order-amount {
  grid-row: 2/4;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

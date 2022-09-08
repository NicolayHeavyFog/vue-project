<template>
  <BaseLoader class="content" v-if="cartLoading"/>
  <main class="content container" v-else-if="!cartLoading" ref="entireContent" >
    <div class="content__top" ref="breadcrumbs">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{totalAmount}} {{declensionWord(totalAmount)}}
      </span>
    </div>
    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field" ref="form">
          <ul class="cart__list">
            <CartItem v-for="offer in offers" :offer="offer" :key="offer.offerCartId"/>
          </ul>
        </div>

        <div class="cart__block" ref="cartBlock">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{numberFormat(this.totalPrice)}} ₽</span>
          </p>

          <router-link v-slot="{navigate}" :to="{name: 'order'}" custom>
            <BaseButtonPrimary
              class="cart__button"
              type="button"
              :disabled="!totalAmount"
              @click="navigate"
            >
            Оформить заказ
            </BaseButtonPrimary>
            <!-- <button class="button cart__button button--primery" type="button" :disabled="!totalAmount" @click="navigate">Оформить заказ</button> -->
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import CartItem from '@/components/CartItem.vue';
// import { defineComponent } from 'vue';
import numberFormat from '@/helpers/numberFormat';
import BaseLoader from '@/components/BaseLoader.vue';
import BaseButtonPrimary from '@/components/BaseButtonPrimary.vue';
import declensionWord from '@/helpers/declensionWord';
import { animateTransitionFromTo, defaultTransitionAppear } from '@/animation/common';
import { nextTick } from 'vue';

export default {
  components: { CartItem, BaseLoader, BaseButtonPrimary },
  data() {
    return {
      pathFrom: null,
      // cartLoading: this.$store.state.cartLoading,
    };
  },
  computed: {
    ...mapGetters({ offers: 'cartProductsData', totalPrice: 'cartTotalPrice', totalAmount: 'cartTotalAmount' }),

    cartLoading() {
      return this.$store.state.cartLoading;
    },
  },
  methods: {
    numberFormat,
    declensionWord,
  },
  async mounted() {
    await nextTick();
    const { entireContent } = this.$refs;
    if (this.pathFrom === 'order') {
      animateTransitionFromTo(entireContent, { xFrom: -400, xTo: '0' }, true);
    } else if (this.pathFrom === 'product' || this.pathFrom === 'main') {
      animateTransitionFromTo(entireContent, { xFrom: 400, xTo: '0' }, true);
    } else {
      defaultTransitionAppear(entireContent);
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // eslint-disable-next-line no-param-reassign
      vm.pathFrom = from.name;
    });
  },
  beforeRouteLeave(to, from, next) {
    const { entireContent } = this.$refs;
    if (to.name === 'product' || to.name === 'main') {
      animateTransitionFromTo(entireContent, { xFrom: '0', xTo: 400 }, false);
      setTimeout(() => {
        next();
      }, 1000);
    }
    if (to.name === 'order') {
      animateTransitionFromTo(entireContent, { xFrom: '0', xTo: -400 }, false);
      setTimeout(() => {
        next();
      }, 1000);
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  min-height: 1000px;
}
</style>

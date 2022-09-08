<template>
  <BaseLoader class="content" v-if="cartLoading"/>
  <main class="content container" v-if="!cartLoading" ref="entireContent">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span> №{{$route.params.id}}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                <!-- Иванова Василиса Алексеевна -->
                {{orderInfo.name}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                <!-- Москва, ул. Ленина, 21, кв. 33 -->
                {{orderInfo.address}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                <!-- 8 800 989 74 84 -->
                {{orderInfo.phone}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                <!-- lalala@mail.ru -->
                {{orderInfo.email}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                картой при получении
              </span>
            </li>
          </ul>
        </div>

        <CartBlock
        :shipping="shippingCost"
        :offers="orderInfo.items"
        :total-price="totalPrice + shippingCost">
        </CartBlock>
      </form>
    </section>
  </main>
</template>

<script>
import CartBlock from '@/components/CartBlock.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import { nextTick } from 'vue';
import { animateTransitionFromTo, defaultTransitionAppear } from '@/animation/common';

export default {
  components: { CartBlock, BaseLoader },
  data() {
    return {
      pathFrom: null,
    };
  },
  computed: {
    orderInfo() {
      const orderI = this.$store.getters.orderInfo;
      if (orderI) {
        return {
          items: orderI.basket.items.map((order) => ({
            offerId: order.productOffer.id,
            offerTitle: order.productOffer.title,
            offerPrice: order.productOffer.price,
            productProp: [
              {
                value: order.productOffer.propValues[0].value,
              },
            ],
            color: {
              title: order.color.color.title,
            },
            amount: order.quantity,
          })),
          name: orderI.name,
          email: orderI.email,
          address: orderI.address,
          paymentType: orderI.paymentType,
          phone: orderI.phone,
          status: orderI.status,
          totalPrice: orderI.totalPrice,
          deliveryType: orderI.deliveryType,
        };
      }
      return {};
    },
    shippingCost() {
      if (!this.orderInfo.deliveryType) return 0;
      return Number(this.orderInfo.deliveryType.price);
    },
    totalPrice() {
      if (!this.orderInfo.totalPrice) return 0;
      return this.orderInfo.totalPrice;
    },
    cartLoading() {
      return this.$store.getters.cartLoading;
    },
  },
  created() {
    // if (this.$store.getters.orderInfo && this.$store.getters.orderInfo.id === this.$route.params.id) {
    //   return;
    // }
    this.$store.dispatch('loadOrderInfo', this.$route.params.id);
  },
  watch: {
    cartLoading: {
      async handler(value) {
        if (!value) {
          await nextTick();
          const { entireContent } = this.$refs;
          console.log(entireContent);
          if (this.pathFrom === 'order') {
            console.log('yes');
            animateTransitionFromTo(entireContent, { xFrom: 400, xTo: '0' }, true);
          } else {
            defaultTransitionAppear(entireContent);
          }
        }
      },
      immediate: true,
    },

  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      console.log(from.name);
      // eslint-disable-next-line no-param-reassign
      vm.pathFrom = from.name;
    });
  },
};
</script>

<style lang="scss" scoped>
.content {
  min-height: 1000px;
}
</style>

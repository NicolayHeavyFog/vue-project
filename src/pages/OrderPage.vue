<template>
  <main class="content container" ref="entireContent">
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
        Корзина
      </h1>
      <span class="content__info">
        {{cartTotalAmount}} {{declensionWord(cartTotalAmount)}}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#"
       method="POST"
       @submit.prevent="order()">
        <div class="cart__field">
          <div class="cart__data">

            <BaseFormText
            v-model="formData.name"
            :error="formError.name"
            :title="'ФИО'"
            :placeholder="'Введите ваше полное имя'"/>

            <BaseFormText
            v-model="formData.address"
            :error="formError.address"
            :title="'Адрес доставки'"
            :placeholder="'Введите ваш адрес'"/>

            <BaseFormText
            v-model="formData.phone"
            :error="formError.phone"
            :title="'Телефон'"
            :placeholder="'Введите ваш телефон'"/>

            <BaseFormText
            v-model="formData.email"
            :error="formError.email"
            :title="'Email'"
            :placeholder="'Введи ваш Email'"/>

            <BaseFormTextarea
            :title="'Комментарий к заказу'"
            :error="formError.comment"
            v-model="formData.comment"
            :placeholder="'Ваши пожелания'"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item"
              v-for="delivery of availableDeliveries"
              :key="delivery.id">
                <label class="options__label">
                  <input class="options__radio sr-only"
                  type="radio"
                  name="delivery"
                  :value="delivery.id"
                  v-model="deliveryTypeId"
                  >
                  <span class="options__value">
                    {{delivery.title}} <b>{{String(delivery.price) === '0' ? 'бесплатно' : `${numberFormat(delivery.price)} ₽`}}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title" v-if="deliveryTypeId">Оплата</h3>

            <ul class="cart__options options">
              <li class="options__item"
              v-if="paymentLoading">
                <BaseLoaderCircle class="cart__item--loading"/>
              </li>
              <li class="options__item"
              v-for="payment of availablePayments"
              :key="payment.id">
                <label class="options__label" v-if="!paymentLoading">
                  <input class="options__radio sr-only"
                   type="radio"
                   name="pay"
                   :value="payment.id"
                   v-model="paymentTypeId">
                  <span class="options__value">
                    {{payment.title}}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <CartBlock
        :shipping="shippingСost"
        :offers="offers"
        :total-price="totalPrice">

          <BaseButtonPrimary
            class="cart__button"
            type="submit"
            :disabled="!cartTotalAmount || !paymentTypeId"
          >
            Оформить заказ
          </BaseButtonPrimary>
        </CartBlock>

        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{formErrorMessage}}
          </p>
        </div>

        <div class="cart__error form__error-block" style="border-color: green" v-if="messageSuccessOrder">
          <h4 style="color: green">Заявка отправлена!</h4>
          <p>
            {{messageSuccessOrder}}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseButtonPrimary from '@/components/BaseButtonPrimary.vue';
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import CartBlock from '@/components/CartBlock.vue';
import { mapGetters } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import declensionWord from '@/helpers/declensionWord';
import numberFormat from '@/helpers/numberFormat';
import BaseLoaderCircle from '@/components/BaseLoaderCircle.vue';
import { nextTick } from 'vue';
import { animateTransitionFromTo, defaultTransitionAppear } from '@/animation/common';

export default {
  components: {
    BaseFormText, BaseFormTextarea, CartBlock, BaseLoaderCircle, BaseButtonPrimary,
  },
  data() {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      messageSuccessOrder: '',
      availableDeliveries: [],
      availablePayments: [],
      deliveryTypeId: null,
      paymentTypeId: null,
      paymentLoading: false,
      shippingСost: 0,
      pathFrom: null,
    };
  },
  computed: {
    ...mapGetters({
      offers: 'cartProductsData', totalPrice: 'cartTotalPrice', cartTotalAmount: 'cartTotalAmount',
    }),
    cartLoading() {
      return this.$store.state.cartLoading;
    },
  },
  methods: {
    numberFormat,
    declensionWord,
    order() {
      this.formError = {};
      this.formErrorMessage = '';
      this.messageSuccessOrder = '';
      axios
        .post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
          paymentTypeId: this.paymentTypeId,
          deliveryTypeId: this.deliveryTypeId,
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((response) => {
          console.log(response);
          this.messageSuccessOrder = 'Успешно';
          this.$store.commit('resetCart');
          this.$store.commit('updateOrderInfo', response.data);
          this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
        })
        .catch((error) => {
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        });
    },
    deliveryType() {
      // this.deliveryTypeId = null,
      // this.paymentTypeId = null,
      axios
        .get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => {
          console.log(response);
          this.availableDeliveries = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

  },
  watch: {
    deliveryTypeId(value) {
      this.paymentLoading = true;
      axios
        .get(
          `${API_BASE_URL}/api/payments`,
          {
            params: {
              deliveryTypeId: value,
            },
          },
        )
        .then((response) => {
          this.availablePayments = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
      this.paymentTypeId = null;
      this.paymentLoading = false;
      const chosenDelivery = this.availableDeliveries.find((delivery) => delivery.id === value);
      this.shippingСost = Number(chosenDelivery.price);
    },
  },
  created() {
    this.deliveryType();
  },
  async mounted() {
    await nextTick();
    const { entireContent } = this.$refs;
    console.log(this.pathFrom);

    if (this.pathFrom === 'cart') {
      animateTransitionFromTo(entireContent, { xFrom: 400, xTo: '0' }, true);
    } else if (this.pathFrom === 'orderInfo') {
      animateTransitionFromTo(entireContent, { xFrom: -400, xTo: '0' }, true);
    } else {
      defaultTransitionAppear(entireContent);
    }
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

<style>
/* .cart__item--loading {

} */
</style>

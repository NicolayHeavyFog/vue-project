<template>
  <li>
    <div class="catalog__item-load" v-if="!picIsLoad || status.addSending">
      <BaseLoaderCircle />
    </div>
    <div v-bind="$attrs" :style="status.addSending ? 'display:none' : 'display: flex'">
      <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
        <img :src="product.image" :srcset="product.imageHigh" :alt="product.item" ref="pic" />
      </router-link>

      <h3 class="catalog__title">
        <a href="#" @click.prevent="openQuickView">
          {{ product.title }}
        </a>
      </h3>

      <span class="catalog__price"> {{ numberFormat(product.price) }} ₽ </span>
      <span class="catalog__item-params">{{ propTitle }}</span>
      <ProductProp
        :available-params="availableParams"
        :productId="product.id"
        :property="property"
        v-model:chosen-property="currentProperty"
      />
      <span class="catalog__item-params">Цвет</span>
      <ProductProp
        :available-params="colorsOffer"
        :productId="product.id"
        :property="'color'"
        v-model:chosen-property="currentColorOffer"
      />
      <BaseButtonPrimary
        class="button__buy"
        :disabled="!(currentColorOffer && currentOffer)"
        @click="doAddToCart(currentOffer, currentColorOffer)"
      >
        Купить
      </BaseButtonPrimary>
    </div>
    <BaseNotification :finish="status.added || status.error" :loading="status.addSending">
      <div class="notification-cart" v-if="status.added">
        <svg
          width="50"
          height="50"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 50 50"
          style="enable-background: new 0 0 50 50"
          xml:space="preserve"
        >
          <circle style="fill: #8be000" cx="25" cy="25" r="25" />
          <polyline
            style="
              fill: none;
              stroke: #272727;
              stroke-width: 2;
              stroke-linecap: round;
              stroke-linejoin: round;
              stroke-miterlimit: 10;
            "
            points="
            38,15 22,33 12,25 "
          />
        </svg>
        <span class="notification-cart__message">
          <span> Товар добавлен в корзину </span>
        </span>
        <router-link :to="{ name: 'cart' }" class="notification-cart__link"
          >Перейти в коризну</router-link
        >
      </div>
      <div class="notification-cart" v-else-if="!currentColorOffer">
        <span class="notification-cart__message"> Вы забыли выбрать цвет товара. </span>
      </div>
      <div class="notification-cart" v-else-if="status.error">
        <svg
          width="50"
          height="50"
          style="overflow: visible; enable-background: new 0 0 32 32"
          viewBox="0 0 32 32"
          xml:space="preserve"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <circle cx="16" cy="16" id="BG" r="16" style="fill: #d72828" />
          <path
            d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z"
            id="Exclamatory_x5F_Sign"
            style="fill: #272727"
          />
        </svg>
        <span class="notification-cart__message">
          <span>
            {{ status.text }}
          </span>
        </span>
      </div>
    </BaseNotification>
  </li>
</template>

<script>
import BaseLoaderCircle from '@/components/BaseLoaderCircle.vue';
import BaseButtonPrimary from '@/components/BaseButtonPrimary.vue';
// import BaseModal from '@/components/BaseModal.vue';
import numberFormat from '@/helpers/numberFormat';
// import ProductMemory from '@/components/ProductMemory.vue';
// import { defineAsyncComponent, h } from 'vue';
import validateProduct from '@/helpers/validatorProduct';
// import ProductColor from './ProductColor.vue';
import ProductProp from '@/components/ProductProp.vue';
import BaseNotification from '@/components/BaseNotification.vue';

export default {
  components: {
    ProductProp,
    BaseLoaderCircle,
    BaseButtonPrimary,
    BaseNotification,
    // ProductQuickView: defineAsyncComponent({
    //   loader: () => import('@/components/ProductQuickView.vue'),
    //   delay: 0,
    //   loadingComponent: () => h('div', 'Загрузка'),
    // }),
  },
  inheritAttrs: false,
  props: {
    product: {
      required: true,
      validator: (value) => validateProduct(value),
    },
    picIsLoad: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      property: this.product.mainProp.code,
      productOffers: this.product.offers,
      isQuickViewOpen: false,
      currentProperty: null,
      currentColorOffer: null,
      status: {},
      isShowAddedMessage: false,
    };
  },
  emits: ['update:picIsLoad'],
  methods: {
    numberFormat,
    doAddToCart(offer, chosenColorTitle) {
      this.status.addSending = true;
      if (!chosenColorTitle || !offer) {
        setTimeout(() => {
          this.status.error = true;
          this.status.addSending = false;
          this.status.text = 'Укажите все обязательные параметры';
        }, 0);
      } else {
        const offerId = offer.id;
        const chosenColorId = this.$store.getters.colors.find(
          (color) => color.title === chosenColorTitle,
        ).id;
        this.$store
          .dispatch('addProductToCart', {
            productId: offerId,
            chosenColor: chosenColorId,
            amount: 1,
          })
          .then(() => {
            const response = this.$store.getters.cartStatusError;
            if (response.status) {
              this.status.error = true;
              this.status.addSending = false;
              this.status.text = response.textError;
              this.status.added = false;
            } else {
              this.isShowAddedMessage = true;
              this.status.added = true;
              this.status.addSending = false;
            }
          })
          .catch(() => {
            this.status.error = true;
            this.status.addSending = false;
          });
      }
    },
  },
  computed: {
    chosenOffer() {
      return this.$store.getters.chosenOffers.find((offer) => {
        if (offer.productId) return offer.productId === +this.$route.params.id;
        return null;
      });
    },
    propTitle() {
      if (this.product) return this.product.offers[0].propValues[0].productProp.title;
      return '';
    },
    chosenProperty() {
      const offer = this.$store.getters.chosenOffers.find((o) => o.productId === this.product.id);
      if (offer) return offer.offer.propValues[0].value;
      return null;
    },
    availableParams() {
      return this.product.offers.map((offer) => ({
        offerProp: offer.propValues[0].value,
        offerValue: this.product.colors.find(
          (color) => color.color.title.replaceAll('ё', 'е') === offer.propValues[0].value,
        ),
      }));
    },
    colorsOffer() {
      if (this.product) {
        return this.product.colors.map((color) => ({
          offerProp: color.color.title,
          offerValue: {
            color: {
              code: color.color.code,
            },
          },
        }));
      }
      return [];
    },
    currentOffer() {
      if (this.currentProperty) {
        return this.product.offers.find(
          (offer) => offer.propValues[0].value === this.currentProperty,
        );
      }

      if (this.chosenOffer) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.currentProperty = this.chosenOffer.offer.propValues[0].value;
        return this.chosenOffer.offer;
      }
      return null;
    },
  },
  watch: {
    chosenProperty: {
      handler(value) {
        if (value) this.currentProperty = value;
      },
      immediate: true,
    },
    currentProperty: {
      handler(value) {
        const chosenOffer = this.product.offers.find(
          (offer) => offer.propValues[0].value === value,
        );
        if (value) {
          this.$store.commit('addChosenOffers', { productId: this.product.id, offer: chosenOffer });
        }
      },
    },
    currentOffer: {
      handler(value) {
        if (value) {
          this.$store.commit('addChosenOffers', {
            offer: this.currentOffer,
            productId: this.product.id,
          });
        }
      },
      deep: true,
    },
    status: {
      handler(value) {
        if (value.addSending) {
          console.log('Добавление');
        } else {
          console.log('Добавлен');
        }
      },
      deep: true,
    },
  },
  mounted() {
    const { pic } = this.$refs;
    const implementationLoad = new Image();
    implementationLoad.onload = () => {
      pic.src = implementationLoad.src;
      this.$emit('update:picIsLoad', true);
    };

    implementationLoad.src = pic.src;
  },
};
</script>

<style lang="scss" scoped>
.catalog__pic {
  height: 250px;
  & img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
}

.catalog__item--hiden {
  opacity: 0;
}

.catalog__item-load {
  height: 100%;
  width: 100%;
}

.catalog__item-params {
  display: block;
  margin-bottom: 5px;
}

.catalog__item {
  height: 550px;
  display: flex;
  flex-direction: column;
}

.button__buy {
  width: 100%;
  height: 40px;
  padding: 10px 15px;
  margin-top: auto;

  &:focus,
  &:hover {
    background-color: #272727;
    color: #fff;
  }
}

.notification-cart {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: 80px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 15px;

  svg {
    margin-bottom: 15px;
  }

  &__message {
    font-size: 22px;
  }

  &__link {
    color: #8be000;
    font-weight: 700;
    border-bottom: 2px dashed transparent;
    padding-top: 15px;

    &:hover {
      border-color: #8be000;
    }
  }
}
</style>

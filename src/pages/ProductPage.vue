<template>
  <BaseLoader class="content container" v-if="productStatus.isLoading" />
  <main class="content container" v-else-if="productStatus.isFailed">
    <div class="">
      Произошла ошибка... <button @click.prevent="loadProducts">Перезагрузить</button>
    </div>
  </main>
  <main class="content container" ref="entireContent" v-if="!productStatus.isLoading">
    <div class="content__top" ref="breadcrumbs">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }"> Каталог </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item" ref="cartBlock">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <div style="width: 570px; height: 570px;" ref="loader">
            <BaseLoaderCircle/>
          </div>
          <img width="570" height="570"
          :src="product.image"
          :alt="product.title"
          ref="image"/>
        </div>
      </div>

      <div class="item__info">
        <span class="item__code"
          >Артикул: {{ currentOffer ? currentOffer.id : product.productId }}</span
        >
        <h2 class="item__title">
          {{ currentOffer ? currentOffer.title : product.title }}
          {{ currentColorOffer ? currentColorOffer : "" }}
        </h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="doAddToCart(currentOffer, currentColorOffer)"
          >
            <b class="item__price">
              {{ currentOffer ? numberFormat(currentOffer.price) : product.pricePretty }} ₽
            </b>

            <fieldset class="form__block">
              <legend class="form__legend">{{ propTitle }} (Обязательно)</legend>
              <ProductProp
                :available-params="availableParams"
                :productId="product.productId"
                :property="product.mainProp"
                v-model:chosen-property="currentProperty"
              />
            </fieldset>

            <fieldset class="form__block">
              <!-- {{propTitle === 'Цвет' ? 'Дополнительный цвет' : 'Цвет (Обязательно)'}} -->
              <legend class="form__legend">Цвет (Обязательно)</legend>
              <ProductProp
                :available-params="colorsOffer"
                :productId="product.productId"
                :property="'color'"
                v-model:chosen-property="currentColorOffer"
              />
            </fieldset>

            <!-- <fieldset class="form__block">
              <legend class="form__legend">Цвет: </legend>
              <ProductProp :offers="product.offers" :productId="product.productId" :property="product.mainProp"/>
            </fieldset> -->

            <div class="item__row">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click="productAmount--">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount" />

                <button type="button" aria-label="Добавить один товар" @click="productAmount++">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>
              <BaseButtonPrimary
                type="submit"
                :disabled="productStatus.addSending"
              >
                В корзину
              </BaseButtonPrimary>
              <!-- <button
                class="button button--primery"
                type="submit"
                :disabled="productStatus.addSending"
              >
                В корзину
              </button> -->
            </div>

            <BaseNotification
              :finish="addingStatus.added || addingStatus.error"
              :loading="addingStatus.addSending"
            >
              <div class="notification-cart" v-if="addingStatus.added">
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
              <div class="notification-cart" v-else-if="addingStatus.error">
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
                    {{ addingStatus.text }}
                  </span>
                </span>
              </div>
            </BaseNotification>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a
              class="tabs__link"
              href="#"
              :class="{ 'tabs__link--current': tab === 'description' }"
              @click.prevent="tab = 'description'"
            >
              Описание
            </a>
          </li>
          <li class="tabs__item">
            <a
              class="tabs__link"
              href="#"
              :class="{ 'tabs__link--current': tab === 'characteristics' }"
              @click.prevent="tab = 'characteristics'"
            >
              Характеристики
            </a>
          </li>
          <li class="tabs__item">
            <a
              class="tabs__link"
              href="#"
              :class="{ 'tabs__link--current': tab === 'warranty' }"
              @click.prevent="tab = 'warranty'"
            >
              Гарантия
            </a>
          </li>
          <li class="tabs__item">
            <a
              class="tabs__link"
              href="#"
              :class="{ 'tabs__link--current': tab === 'delivery' }"
              @click.prevent="tab = 'delivery'"
            >
              Оплата и доставка
            </a>
          </li>
        </ul>
        <ul class="tabs__list">
          <li class="item__content item__content--active"
          ref="targetDescription"
          >
            <h3>{{ product.title }}</h3>
            <p>Доступен в расцветках:</p>

            <ul>
              <li v-for="offer in product.offers" :key="offer.id">
                {{ offer.propValues[0].value }}
              </li>
            </ul>

            <a href="#" @click.prevent="tab = 'characteristics'"> Все характеристики </a>
          </li>

          <li class="item__content"
          ref="targetCharacteristics"
          >
            <ul>
              <li v-for="specification in product.specifications" :key="specification.id">
                {{ specification.title }} - {{ specification.value }}
              </li>
            </ul>
          </li>
          <li class="item__content"
          ref="targetWarranty">
            loremloremloremloremloremloremloremloremloremlorem
          </li>
          <li class="item__content"
          ref="targetDelivery">
            loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import BaseLoader from '@/components/BaseLoader.vue';
import BaseNotification from '@/components/BaseNotification.vue';
import ProductProp from '@/components/ProductProp.vue';
import BaseButtonPrimary from '@/components/BaseButtonPrimary.vue';
import {
  defineComponent, nextTick, onMounted, onUpdated, ref, watch,
} from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';
import useProduct from '@/hooks/useProduct';
import useAddProduct from '@/hooks/useAddProduct';
import useAddOffer from '@/hooks/useAddOffer';
import useImplementationLoad from '@/hooks/useImplementationLoad';
import { shake } from '@/animation/productPage';
import BaseLoaderCircle from '@/components/BaseLoaderCircle.vue';
import {
  animateTransitionToCart, animateTransitionFromTo, defaultTransitionAppear, defaultFadeContent,
} from '@/animation/common';
import tabsSwiper from '@/animation/tabsSwiper';

export default defineComponent({
  components: {
    BaseLoader, BaseNotification, ProductProp, BaseLoaderCircle, BaseButtonPrimary,
  },
  methods: {
  },
  // eslint-disable-next-line vue/no-setup-props-destructure
  setup() {
    const $route = useRoute();
    const entireContent = ref(null);
    const pathFrom = ref(null);
    const breadcrumbs = ref(null);
    const cartBlock = ref(null);

    const {
      product, category, fetchProduct, status: productStatus,
    } = useProduct();

    fetchProduct($route.params.id);

    const {
      currentProperty,
      currentColorOffer,
      currentOffer,
      propTitle,
      colorsOffer,
      availableParams,
    } = useAddOffer(product);

    const {
      doAddToCart,
      isShowAddedMessage,
      status: addingStatus,
      productAmount,
    } = useAddProduct();

    const {
      tab,
      targetDescription,
      targetCharacteristics,
      targetWarranty,
      targetDelivery,
      calculateTab,
    } = tabsSwiper();

    const {
      image, loader, doImplementation,
    } = useImplementationLoad();

    onUpdated(() => {
      calculateTab();
    });

    onMounted(() => {
      if (pathFrom.value) {
        if (pathFrom.value === 'main') animateTransitionFromTo(entireContent.value, { yFrom: 200, yTo: '0' }, true);
        else if (pathFrom.value === 'cart') animateTransitionFromTo(entireContent.value, { xFrom: -200, xTo: '0' }, true);
      } else defaultTransitionAppear(entireContent.value);
    });

    onBeforeRouteLeave((to, from, next) => {
      if (to.name === 'cart') {
        const cartIndicator = document.querySelector('.header__cart');
        animateTransitionToCart(cartIndicator, entireContent.value);
        setTimeout(() => {
          next();
        }, 700);
      } else {
        defaultFadeContent(entireContent.value);
        setTimeout(() => {
          next();
        }, 400);
      }
    });

    watch(productStatus, async () => {
      if (!productStatus.isLoading) {
        await nextTick();
        if (pathFrom.value) {
          if (pathFrom.value === 'main') animateTransitionFromTo(entireContent.value, { yFrom: 200, yTo: '0' }, true);
          else if (pathFrom.value === 'cart') animateTransitionFromTo(entireContent.value, { xFrom: -200, xTo: '0' }, true);
        } else defaultTransitionAppear(entireContent.value);
        doImplementation();
      }
    }, { immediate: true, deep: true });

    watch(addingStatus, () => {
      console.log(addingStatus);
      if (addingStatus.error) {
        const props = document.querySelectorAll('.form__block');
        shake(props);
      }
    }, { immediate: true, deep: true });

    watch(productAmount, () => {
      if (productAmount.value < 1) productAmount.value = 1;
    });

    return {
      breadcrumbs,
      cartBlock,
      pathFrom,
      productAmount,
      entireContent,
      currentProperty,
      currentColorOffer,
      productStatus,
      addingStatus,
      product,
      category,
      currentOffer,
      propTitle,
      colorsOffer,
      image,
      loader,
      isShowAddedMessage,
      doAddToCart,
      numberFormat,
      availableParams,
      tab,
      targetCharacteristics,
      targetDescription,
      targetWarranty,
      targetDelivery,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // eslint-disable-next-line no-param-reassign
      vm.pathFrom = from.name;
    });
  },
});
</script>

<style scoped lang="scss">
.content {
  min-height: 1000px;
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
    // display: flex;
    // align-items: center;
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

.tabs {
  &__list {
    min-height: 216px;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
  }
}

.item {
  // &__desc {
    // overflow: hidden;
  // }
  &__content {
    display: none;
    min-height: 216px;
    min-width: 595px;
    &--active {
      display: block;
    }
  }

}

// .item__content--active {
//   display: block;
// }
</style>

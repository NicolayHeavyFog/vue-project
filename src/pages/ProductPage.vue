<template>
<div>
  <main class="content container" v-if="productLoading">
    <div class="loader-container">
      <div class="loader">
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__bar"></div>
        <div class="loader__ball"></div>
      </div>
    </div>
  </main>
  <main class="content container" v-else-if="!productData">
    <div class="">Произошла ошибка... <button @click.prevent="loadProducts">Перезагрузить</button> </div>
  </main>
  <main class="content container" v-if="!productLoading">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            {{category.title}}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
           {{product.title}}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="product.image" :alt="product.title">
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{product.id}}</span>
        <h2 class="item__title">
          {{product.title}}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <b class="item__price">
              {{product.price | numberFormat }} ₽
            </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item"
                 v-for='currentColor in colorsPull'
                 :key ='product.id * currentColor.id'>
                  <label class="colors__label">
                    <input class="colors__radio sr-only" type="radio" name="color-item"
                    :value="currentColor.id"
                    :checked="currentColor.id === chosenColor"
                    @click="chooseColor(currentColor.id)"
                    v-model="color">
                    <span class="colors__value" :style="style(currentColor.code)">
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">Объемб в ГБ:</legend>

              <ul class="sizes sizes--primery">
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input class="sizes__radio sr-only" type="radio" name="sizes-item" value="32">
                    <span class="sizes__value">
                      32gb
                    </span>
                  </label>
                </li>
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input class="sizes__radio sr-only" type="radio" name="sizes-item" value="64">
                    <span class="sizes__value">
                      64gb
                    </span>
                  </label>
                </li>
                <li class="sizes__item">
                  <label class="sizes__label">
                    <input class="sizes__radio sr-only" type="radio" name="sizes-item" value="128" checked="">
                    <span class="sizes__value">
                      128gb
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click="productAmount--">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount">

                <button type="button" aria-label="Добавить один товар" @click="productAmount++">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <button class="button button--primery" type="submit"
              :disabled="productAddSending">
                В корзину
              </button>
            </div>

            <div v-show='productAdded'>Товар добавлен в корзину</div>
            <div v-show='productAddSending'>Проиходит отправка этого товара в корзину</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current">
              Описание
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Характеристики
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Гарантия
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Оплата и доставка
            </a>
          </li>
        </ul>

        <div class="item__content">
          <p>
            Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br>
            Синхронизация со смартфоном<br>
            Связь по Bluetooth Smart, ANT+ и Wi-Fi<br>
            Поддержка сторонних приложений<br>
          </p>

          <a href="#">
            Все характеристики
          </a>

          <h3>Что это?</h3>

          <p>
            Wahoo ELEMNT BOLT GPS – это велокомпьютер, который позволяет оптимизировать свои велотренировки, сделав их максимально эффективными.
            Wahoo ELEMNT BOLT GPS синхронизируется с датчиками по ANT+, объединяя полученную с них информацию.
            Данные отображаются на дисплее, а также сохраняются на смартфоне. При этом на мобильное устройство можно установить как фирменное приложение, так и различные приложения сторонних разработчиков.
             Велокомпьютер точно отслеживает местоположение, принимая сигнал с целого комплекса спутников. Эта информация позволяет смотреть уже преодоленные маршруты и планировать новые велопрогулки.
          </p>

          <h3>Дизайн</h3>

          <p>
            Велокомпьютер Wahoo ELEMNT BOLT очень компактный. Размеры устройства составляют всего 74,6 x 47,3 x 22,1 мм. что не превышает габариты смартфона.
             Корпус гаджета выполнен из черного пластика. На обращенной к пользователю стороне расположен дисплей диагональю 56 мм.
             На дисплей выводятся координаты и скорость, а также полученная со смартфона и синхронизированных датчиков информация: интенсивность, скорость вращения педалей, пульс и т.д.
             (датчики не входят в комплект поставки). Корпус велокомпьютера имеет степень защиты от влаги IPX7. Это означает, что устройство не боится пыли,
              а также выдерживает кратковременное (до 30 минут) погружение в воду на глубину не более 1 метра.
          </p>
        </div>
      </div>
    </section>
  </main>
</div>
</template>

<script>
// import products from '@/data/products';
// import categories from '@/data/categories';
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
// import colors from '../data/colors';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      productAmount: 1,
      color: null,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,

      productAdded: false,
      productAddSending: false,
    };
  },
  filters: {
    numberFormat,
  },
  computed: {
    product() {
      const image = this.productData.image.file.url;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.productData.image = image;
      return this.productData;
    },
    category() {
      return this.product.category;
    },
    colorsPull() {
      return this.product.colors;
    },
    chosenColor() {
      if (this.$route.params.color) return +this.$route.params.color.color;
      return null;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),
    gotoPage,
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.addProductToCart({ productId: this.product.id, amount: this.productAmount })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        });
    },

    loadProduct() {
      console.log('loadProduct');
      this.productLoading = true;
      this.productLoadingFailed = false;
      clearTimeout(this.loadProductsItem);
      this.loadProductsItem = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
          .then((response) => this.productData = response.data)
          .catch(() => { this.productLoadingFailed = true; })
          .then(() => { this.productLoading = false; });
      }, 5000);
    },
    style(code) {
      return `background-color: ${code};`;
    },
    chooseColor(color) {
      this.color = color;
    },
  },
  created() {
    this.color = this.chosenColor;
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
$bar-color: #272727;
$ball-color: #272727;
$bg-color: #fff;
.loader {
  position: relative;
  width: 75px;
  height: 100px;

  &-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__bar {
    position: absolute;
    bottom: 0;
    width: 10px;
    height: 50%;
    background: $bar-color;
    transform-origin: center bottom;
    box-shadow: 1px 1px 0 rgba(0,0,0,.2);

    @for $i from 1 through 5 {
       &:nth-child(#{$i}) {
         left: ($i - 1) * 15px;
         transform: scale(1,$i*.2);
         animation: barUp#{$i} 4s infinite;
        }
    }

  }

  &__ball {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 10px;
    height: 10px;
    background: $ball-color;
    border-radius: 50%;
    animation: ball 4s infinite;
  }
}

@keyframes ball {
  0% {
    transform: translate(0, 0);
  }
  5% {
    transform: translate(8px, -14px);
  }
  10% {
    transform: translate(15px, -10px)
  }
  17% {
    transform: translate(23px, -24px)
  }
  20% {
    transform: translate(30px, -20px)
  }
  27% {
    transform: translate(38px, -34px)
  }
  30% {
    transform: translate(45px, -30px)
  }
  37% {
    transform: translate(53px, -44px)
  }
  40% {
    transform: translate(60px, -40px)
  }
  50% {
    transform: translate(60px, 0)
  }
  57% {
    transform: translate(53px, -14px)
  }
  60% {
    transform: translate(45px, -10px)
  }
  67% {
    transform: translate(37px, -24px)
  }
  70% {
    transform: translate(30px, -20px)
  }
  77% {
    transform: translate(22px, -34px)
  }
  80% {
    transform: translate(15px, -30px)
  }
  87% {
    transform: translate(7px, -44px)
  }
  90% {
    transform: translate(0, -40px)
  }
  100% {
    transform: translate(0, 0);
  }
}

@keyframes barUp1 {
  0% {
    transform: scale(1, .2);
  }
  40%{
    transform: scale(1, .2);
  }
  50% {
    transform: scale(1, 1);
  }
  90% {
    transform: scale(1,1);
  }
  100% {
    transform: scale(1,.2);
  }
}
@keyframes barUp2 {
  0% {
    transform: scale(1, .4);
  }
  40% {
    transform: scale(1, .4);
  }
  50% {
    transform: scale(1, .8);
  }
  90% {
    transform: scale(1, .8);
  }
  100% {
    transform: scale(1, .4);
  }
}
@keyframes barUp3 {
  0% {
    transform: scale(1, .6);
  }
  100% {
    transform: scale(1, .6);
  }
}
@keyframes barUp4 {
  0% {
    transform: scale(1, .8);
  }
  40% {
    transform: scale(1, .8);
  }
  50% {
    transform: scale(1, .4);
  }
  90% {
    transform: scale(1, .4);
  }
  100% {
    transform: scale(1, .8);
  }
}
@keyframes barUp5 {
  0% {
    transform: scale(1, 1);
  }
  40% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, .2);
  }
  90% {
    transform: scale(1, .2);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>

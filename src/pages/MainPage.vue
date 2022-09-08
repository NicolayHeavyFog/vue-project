<template>
  <main class="content container" ref="catalog">
    <div class="content__top content__top--catalog" ref="titlePage">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info content__info--hidden" v-if="!productsLoading">
        {{ countProducts }} {{ declensionWord(countProducts) }}
      </span>
    </div>

    <div class="content__catalog">
      <aside class="filter" ref="entireFilter">
        <ProductFilter
          v-model:price-from="filterPriceFrom"
          v-model:price-to="filterPriceTo"
          v-model:category-id="filterCategeryId"
          v-model:color-id="filterColorId"
          v-model:category-entries="filterCategeryPropsEntries"
          class="modal-test"
        >
          <div class="page-preferences" ref="pageHandler">
            <span class="page-preferences__title">Количество товаров на странице</span>
            <ul class="page-preferences__list">
              <li class="page-preferences__item" v-for="(item, index) in [9, 18, 36]" :key="index">
                <button
                  class="button button--second page-preferences__button button__circle"
                  @click.prevent="
                    productsPerPage = item;
                    buttonCircle($event, $refs[`circleButton${item}`]);
                  "
                >
                  {{ item }}
                  <span class="circle" :ref="`circleButton${item}`"></span>
                </button>
              </li>
            </ul>
          </div>
        </ProductFilter>
      </aside>

      <section class="catalog">
        <BaseLoader
          class="catalog__notification"
          v-if="productsLoading"
        />
        <div
          v-if="productsLoadingFailed"
          class="catalog__notification"
        >
          Что-то пошло не так...
          <BaseButtonPrimary
            @click.prevent="loadProducts"
          >
            Перезагрузить
          </BaseButtonPrimary>
        </div>
        <div
          class="catalog__notification"
          v-if="!countProducts && !productsLoading"
        >
          К сожалению, по вашему запросу ничего не найдено.
        </div>
        <ProductList
          :products="products"
          v-model:picture-load="pictureIsLoad"
          v-if="productsOpened && countProducts"
        />
        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
          v-if="productsOpened && countProducts"
        />
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import declensionWord from '@/helpers/declensionWord';
import { buttonCircle } from '@/animation/bubblingCircle';
import { animatePageHandler, animateTransitionMainToProduct } from '@/animation/mainPage';
import { animateTransitionToCart } from '@/animation/common';
import BaseButtonPrimary from '@/components/BaseButtonPrimary.vue';

export default {
  components: {
    ProductList,
    BasePagination,
    ProductFilter,
    BaseLoader,
    BaseButtonPrimary,
  },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategeryId: 0,
      filterCategeryPropsEntries: {},
      filterColorId: 0,
      page: 1,
      productsPerPage: 9,
      productsData: null,
      productsLoading: true,
      productsLoadingFailed: false,
      productsOpened: true,
      pictureIsLoad: false,
      chosenProductId: null,
      doUpdateProducts: false,
    };
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => ({
          ...product,
          image: product.preview.file.url,
        }))
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    buttonCircle,
    declensionWord,
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      this.productsOpened = false;
      const result = {};

      if (Object.keys(this.filterCategeryPropsEntries).length !== 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(this.filterCategeryPropsEntries)) {
          const str = `props[${key}][]`;
          value.forEach((item) => {
            result[str] = item;
          });
        }
      }
      const requestFields = { ...result };
      if (this.filterCategeryId) requestFields.categoryId = this.filterCategeryId;
      if (this.filterPriceFrom) requestFields.minPrice = this.filterPriceFrom;
      if (this.filterPriceTo) requestFields.maxPrice = this.filterPriceTo;
      axios
        .get(`${API_BASE_URL}/api/products`, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            ...requestFields,
          },
        })
        .then((response) => {
          this.productsData = response.data;
        })
        .catch(() => (this.productsLoadingFailed = true))
        .then(() => {
          this.productsLoading = false;
          this.productsOpened = true;
          this.doUpdateProducts = false;
        });
    },
    animatePageHandler,
  },
  watch: {
    page() {
      // this.loadProducts();
      this.doUpdateProducts = true;
    },
    filterPriceFrom() {
      // this.loadProducts();
      this.doUpdateProducts = true;
    },
    filterPriceTo() {
      // this.loadProducts();
      this.doUpdateProducts = true;
    },
    filterCategeryId() {
      // this.loadProducts();
      this.doUpdateProducts = true;
    },
    productsPerPage() {
      // this.loadProducts();
      this.doUpdateProducts = true;
    },
    filterCategeryPropsEntries: {
      handler() {
        // this.loadProducts();
        this.doUpdateProducts = true;
      },
      deep: true,
    },
    filterColorId() {
      // this.loadProducts();
      this.doUpdateProducts = true;
    },
    doUpdateProducts(value) {
      if (value) this.loadProducts();
    },
  },
  beforeRouteLeave(to, from, next) {
    const { catalog } = this.$refs;

    if (to.name === 'cart') {
      const cartIndicator = document.querySelector('.header__cart');
      animateTransitionToCart(cartIndicator, catalog);
      setTimeout(() => {
        next();
      }, 700);
    }
    if (to.name === 'product') {
      animateTransitionMainToProduct(catalog);
      setTimeout(() => {
        next();
      }, 400);
    }
  },
  created() {
    this.loadProducts();
  },
  mounted() {
    const { pageHandler } = this.$refs;
    this.animatePageHandler(pageHandler);
  },
};
</script>

<style scoped lang="scss">

.catalog__notification {
  width: 100%;
  height: 100%;
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
  font-family: "PressStart";
  font-size: 25px;
  text-align: center;
  line-height: 35px;
}

.content {
  &__top {
    overflow: hidden;
  }

  &__title {
    overflow: hidden;
  }

  &__info {
    transition: opacity 0.3s ease-in;

    &-hidden {
      opacity: 0;
    }
  }
}

.filter {
  background-color: unset;
  position: relative;
  height: 100%;
}

.circle {
  display: none;
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
}

.button__circle {
  position: relative;
  overflow: hidden;

  &::before {
    z-index: 1000;
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
  }
}

.page-preferences {
  padding: 25px;
  top: 70%;
  position: sticky;
  left: 0;
  display: block;
  width: 100%;
  min-height: 80px;
  background-color: #272727;

  &__title {
    display: block;
    font-family: "PressStart";
    font-size: 16px;
    border-bottom: 4px dashed #fff;
    padding-bottom: 25px;
    margin-bottom: 25px;
  }

  &__list {
    list-style-type: none;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
}
</style>

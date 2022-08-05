<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        152 товара
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter :price-from.sync='filterPriceFrom' :price-to.sync='filterPriceTo' :category-id.sync='filterCategeryId' :color-id.sync='filterColorId'/>
      <section class="catalog" >
        <div class="loader-container" v-if="productsLoading">
          <div class="loader">
            <div class="loader__bar"></div>
            <div class="loader__bar"></div>
            <div class="loader__bar"></div>
            <div class="loader__bar"></div>
            <div class="loader__bar"></div>
            <div class="loader__ball"></div>
          </div>
        </div>
        <div class="" v-if="productsLoadingFailed">Произошла ошибка... <button @click.prevent="loadProducts">Перезагрузить</button> </div>
        <ProductList :products='products' v-if="productsOpened"/>
        <BasePagination v-model='page' :count='countProducts' :per-page="productsPerPage"/>
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
// import products from '@/data/products';
import ProductFilter from '@/components/ProductFilter.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategeryId: 0,
      filterColorId: 0,
      page: 1,
      productsPerPage: 3,
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
      productsOpened: true,
    };
  },
  computed: {
    // filteredProducts() {

    // let filteredProducts = products;
    // if (this.filterPriceFrom > 0) {
    //   filteredProducts = filteredProducts.filter((product) => product.price > this.filterPriceFrom);
    // }
    // if (this.filterPriceTo > 0) {
    //   filteredProducts = filteredProducts.filter((product) => product.price < this.filterPriceTo);
    // }
    // if (this.filterCategeryId) {
    //   filteredProducts = filteredProducts.filter((product) => product.categoryId === this.filterCategeryId);
    // }
    // if (this.filterColorId) {
    //   filteredProducts = filteredProducts.filter((product) => product.colorId === this.filterColorId);
    // }
    // if (this.filterColorId) {
    //   filteredProducts = filteredProducts.filter((product) => product.colorId.includes(this.filterColorId));
    // }
    // return filteredProducts;
    // },
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => ({
          ...product,
          image: product.image.file.url,
        }))
        : [];
      // const offset = (this.page - 1) * this.productsPerPage;
      // return this.filteredProducts.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      // return this.filteredProducts.length;
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategeryId() {
      this.loadProducts();
    },
    filterColorId() {
      this.loadProducts();
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      this.productsOpened = false;
      clearTimeout(this.loadProductsItem);
      this.loadProductsItem = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products`, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategeryId,
            colorId: this.filterColorId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
          },
        })
          .then((response) => this.productsData = response.data)
          .catch(() => this.productsLoadingFailed = true)
          .then(() => { this.productsLoading = false; this.productsOpened = true; });
      }, 5000);
    },

  },
  created() {
    this.loadProducts();
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

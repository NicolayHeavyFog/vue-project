<template>
  <li class="catalog__item" >
      <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id, color: chosenProductColor}}">
        <img :src="product.image" :srcset="product.imageHigh" :alt="product.item">
      </router-link>

      <h3 class="catalog__title">
        <a href="#">
          {{product.title}}
        </a>
      </h3>

      <span class="catalog__price">
        {{product.price | numberFormat}} ₽
      </span>

      <ProductColor @set-color="color => $emit('set-color', color, productId)"
      :product-id ='product.id'
      :color-id="product.colorId"
      :chosen-product-color="chosenProductColor"
      />
    </li>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
import ProductColor from './ProductColor.vue';

export default {
  components: { ProductColor },
  filters: {
    numberFormat,
  },
  data() {
    return {
      productId: this.product.id,
      color: null,
    };
  },
  props: {
    product: {
      require: true,
      validator: (value) => {
        const props = ['image', 'title', 'price', 'id', 'categoryId', 'colorId'];
        const propsObj = Object.getOwnPropertyNames(value);
        if (props.length !== propsObj.length) return false;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < props.length; i++) {
          // eslint-disable-next-line valid-typeof
          if (typeof value[props[i]] === undefined) return false;
        }
        return true;
      },
    },
    chosenProductColor: {
      require: false,
    },
  },
  // watch: {
  //   chosenProductColor(value) {
  //     this.color = value.color;
  //   },
  // },
  methods: {
    gotoPage,
  },
  computed: {
  },
  created() {
    if (this.chosenProductColor) this.color = this.chosenProductColor.color;
  },
};
</script>

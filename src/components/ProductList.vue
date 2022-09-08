<template>
  <ul class="catalog__list" ref="elem">
    <ProductItem
      class="catalog__item catalog__item--hiden"
      v-for="product in products"
      :product="product"
      :key="product.id"
      v-model:pic-is-load="picIsLoad"
    />
  </ul>
</template>

<script>
import validateProducts from '@/helpers/validatorProducts';
import ProductItem from '@/components/ProductItem.vue';
import { animateArrayOfElements } from '@/animation/mainPage';

export default {
  components: { ProductItem },
  props: {
    products: {
      require: true,
      validator: (value) => validateProducts(value),
    },
    pictureLoad: {
      required: true,
      type: Boolean,
    },

  },
  data() {
    return {
      picIsLoad: false,
      quantity: 0,
    };
  },
  methods: {
    animateArrayOfElements,
  },
  emits: ['update:pictureLoad'],
  watch: {
    picIsLoad: {
      handler(value) {
        if (value) {
          this.quantity++;

          const arr = Array.from(this.$refs.elem.children);
          const productList = arr.map((child) => child.querySelector('.catalog__item'));
          this.picIsLoad = false;

          if (this.quantity === arr.length) {
            this.animateArrayOfElements(productList);
            this.$emit('update:pictureLoad', true);
            this.picIsLoad = true;
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>

</style>

<template>
  <ul class="catalog__list">
    <ProductItem :product = 'product' v-for="(product) in products" :key="product.id" :chosenProductColor="returnColor(product.id)"
    @gotoPage="(pageName, pageParams) => $emit('gotoPage', pageName, pageParams)"
    @setColor="(color, productId) => saveColor(color, productId)"/>
  </ul>
</template>

<script>
import ProductItem from './ProductItem.vue';

export default {
  components: { ProductItem },
  props: {
    products: {
      require: true,
      validator: (value) => {
        const props = ['image', 'title', 'price', 'id', 'categoryId', 'colorId'];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < value.length; i++) {
          const currentObj = value[i];
          const propsObj = Object.getOwnPropertyNames(currentObj);
          if (propsObj.length !== props.length) return false;
          // eslint-disable-next-line no-plusplus
          for (let l = 0; l < props.length; l++) {
            // eslint-disable-next-line valid-typeof
            if (typeof currentObj[props[l]] === undefined) return false;
          }
        }
        return true;
      },
    },
  },
  data() {
    return {
      chosenColor: [],
    };
  },
  methods: {
    saveColor(color, productId) {
      let productColors = [];
      productColors = this.chosenColor.filter((product) => product.id !== productId);

      productColors.push({
        id: productId,
        color,
      });
      this.chosenColor = productColors;
    },
    returnColor(productId) {
      return this.chosenColor.find((product) => product.id === productId);
    },
  },

};
</script>

<template>
  <li class="catalog__item" >
      <a class="catalog__pic" href="#" @click.prevent="$emit('gotoPage', 'product', {id: product.id})">
        <img :src="product.image" :srcset="product.imageHigh" :alt="product.item">
      </a>

      <h3 class="catalog__title">
        <a href="#">
          {{product.title}}
        </a>
      </h3>

      <span class="catalog__price">
        {{product.price}} ₽
      </span>

      <ProductColor @setColor="color => $emit('setColor', color, productId)"
      :productId ='product.id'
      :colorId="product.colorId"
      :chosenProductColor="color"/>
    </li>
</template>

<script>
import ProductColor from './ProductColor.vue';

export default {
  components: { ProductColor },
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
  watch: {
    productColor(value) {
      this.color = value.color;
    },
  },
  methods: {
  },
  computed: {
  },
};
</script>

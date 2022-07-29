<template>
  <li class="catalog__item" >
      <a class="catalog__pic" href="#">
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

      <ul class="colors colors--black">
        <li class="colors__item" v-for='colorItem in product.colorId' :key ='product.id * colorItem'>
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" :value="colorItem" @click='chooseСolor(colorItem)'>
            <span class="colors__value" :style="colorsPull.find(color => color.id === colorItem).hex">
            </span>
          </label>
        </li>
      </ul>
    </li>
</template>

<script>
import colors from '../data/colors';

export default {
  data() {
    return {
      colorItem: null,
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
  },
  // model: {
  //   event: 'chooseColor',
  //   value: 'color',
  // },
  methods: {
    // get colorItem() {
    //   return this.colorItem;
    // },
    // set colorItem(value) {
    //   this.colorItem = value;
    // },
    chooseColor(color) {
      this.colorItem = color;
    },
  },
  computed: {
    colorsPull() {
      return colors;
    },
  },
};
</script>

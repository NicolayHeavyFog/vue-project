<template>
  <ul class="colors colors--black">
        <li class="colors__item" v-for='colorItem in colorId' :key ='productId * colorItem'>
          <label class="colors__label">
            <input class="colors__radio sr-only" :checked='color === colorItem' type="radio" :value="colorItem" @click='chooseColor(colorItem)'>
            <span class="colors__value" :style="colorsPull.find(color => color.id === colorItem).hex">
            </span>
          </label>
        </li>
      </ul>
</template>

<script>
import colors from '../data/colors';

export default {
  props: ['productId', 'colorId'],
  data() {
    return {
      color: null,
    };
  },
  model: {
    event: 'chooseColor',
    value: 'color',
  },
  methods: {
    chooseColor(color) {
      this.color = color;
      this.$emit('chooseColor', color);
    },
  },
  computed: {
    colorsPull() {
      return colors;
    },
  },
};
</script>

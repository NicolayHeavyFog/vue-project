<template>
  <ul class="colors colors--black">
        <li class="colors__item" v-for='colorItemId in colorId' :key ='productId * colorItemId'>
          <label class="colors__label">
            <input class="colors__radio sr-only" :checked='colorItemId === color' type="radio" :value="colorItemId"
            @click="chooseColor(colorItemId); $emit('setColor', color)">

            <span class="colors__value" :style="colorsPull.find(color => color.id === colorItemId).hex">
            </span>
          </label>
        </li>
      </ul>
</template>

<script>
import colors from '../data/colors';

export default {
  props: ['productId', 'colorId', 'chosenProductColor'],
  data() {
    return {
      color: null,
    };
  },
  methods: {
    chooseColor(color) {
      this.color = color;
    },
  },
  computed: {
    colorsPull() {
      return colors;
    },
  },
  created() {
    if (this.chosenProductColor) this.color = this.chosenProductColor.color;
  },
};
</script>

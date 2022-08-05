<template>
  <ul class="colors colors--black">
        <li class="colors__item" v-for='currentColor in colorsPull' :key ='currentColor.id'>
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio"
            :checked='currentColor.id === color'
            :value="currentColor.title"
            @click="chooseColor(currentColor.id)">

            <span class="colors__value" :style="currentStyle(currentColor.code)">
            </span>
          </label>
        </li>
      </ul>
</template>

<script>
// import colors from '../data/colors';

export default {
  props: ['colors', 'chosenProductColor'],
  data() {
    return {
      color: null,
    };
  },
  methods: {
    chooseColor(color) {
      this.color = color;
      this.$emit('set-color', color);
    },
    currentStyle(code) { // где стоит мутировать данные, в отдельном методе как здесь?
      return `background-color: ${code};`;
    },
  },
  computed: { // или сразу при получении совершать замешивание с помощью map ....
    colorsPull() {
      return this.colors;
    },
  },
  created() {
    if (this.chosenProductColor) this.color = this.chosenProductColor.color;
  },
};
</script>

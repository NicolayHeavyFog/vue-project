<template>
  <ul class="colors colors--black">
    <li class="colors__item"
    v-for='item in availableSuggestions'
    :key ='getCurrentColorOfSuggestion(item)'>
      <label class="colors__label">
        <input class="colors__radio sr-only" type="radio"
        :checked='getCurrentColorOfSuggestion(item) === colorId'
        :value="availableColors(getCurrentColorOfSuggestion(item))"
        @click="chooseColor()"
        v-model="colorId">

        <span class="colors__value"
        :style="doStyle(colorId.code)"
        >
        </span>

      </label>
    </li>
  </ul>
</template>

<script>
// import validateColors from '@/helpers/validatorColors';

export default {
  props: {
    offers: {
      require: false,
    },
    productId: {
      require: true,
      type: Number,
    },
  },
  data() {
    return {
      colorId: { code: '#fff' },
    };
  },
  computed: {
    availableSuggestions() {
      return this.offers.map((offer) => ({
        suggestion: offer.propValues,
      }));
    },
    colors() {
      return this.$store.getters.colors;
    },
  },
  methods: {
    chooseColor() {
      this.$store.commit('addChosenColor', { colorId: this.colorId, productId: this.productId });
    },
    doStyle(code) { return `background-color: ${code};`; },
    getCurrentColorOfSuggestion(currentSuggestion) {
      return currentSuggestion.suggestion[0].value;
    },
    availableColors(colorName) {
      // console.log(this.colors);
      return this.colors.find((color) => color.title === colorName);
      // return this.availableSuggestions().suggestion;
    },
  },
  created() {
    const p = this.$store.getters.chosenColor.find((product) => product.productId === this.productId);
    if (p) {
      this.colorId = p.colorId;
    }
  },
};
</script>

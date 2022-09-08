<template>
  <ul class="sizes sizes--primery">
    <li class="sizes__item"
    v-for="suggestion in availableSuggestions"
    :key="getCurrentSizeOfSuggestion(suggestion)">
      <label class="sizes__label">
        <input class="sizes__radio sr-only" type="radio"
        :checked="getCurrentSizeOfSuggestion(suggestion) === currentSize"
        :value="getCurrentSizeOfSuggestion(suggestion)"
        @click="chooseMemory(getCurrentSizeOfSuggestion(suggestion))"
        v-model="currentSize"
        >
        <span class="sizes__value">
          {{getCurrentSizeOfSuggestion(suggestion)}}
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    offers: {
      require: true,
      // validator: (value) => validateColors(value),
    },
    productId: {
      require: true,
      type: Number,
    },
  },
  data() {
    return {
      currentSize: null,
    };
  },
  computed: {
    availableSuggestions() {
      return this.offers.map((offer) => ({
        suggestion: offer.propValues,
      }));
    },
  },
  methods: {
    getCurrentSizeOfSuggestion(currentSuggestion) {
      return currentSuggestion.suggestion[0].value;
    },
    chooseMemory(memorySize) {
      this.$store.commit('addChosenMemory', { memorySize, productId: this.productId });
    },
  },
  created() {
    const p = this.$store.getters.chosenMemory.find((product) => product.productId === this.productId);
    if (p) {
      this.currentSize = p.memorySize;
    }
  },
};
</script>

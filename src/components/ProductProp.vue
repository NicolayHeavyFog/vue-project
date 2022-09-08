<template>
  <ul :class="classes.ul">
    <li
      :class="classes.li"
      v-for="param in availableParams"
      :key="param.offerProp"
      >
      <label
        :class="classes.label"
        >
        <input type="radio"
          class="sr-only"
          :class="classes.input"
          :checked="param.offerProp === propertyValue"
          :value="param.offerProp"
          v-model="propertyValue"
          >
        <span
          :class="classes.span"
          :style="[property === 'color' ? doStyle(param.offerValue.color.code) : null]"
          >
          {{property !== 'color' ? ` ${param.offerProp}` : null}}
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    availableParams: {
      require: true,
    },
    productId: {
      require: true,
      type: Number,
    },
    property: {
      type: String,
    },
    chosenProperty: {
      type: String,
    },
  },
  data() {
    return {
      propertyValue: null,
    };
  },
  computed: {
    classes() {
      return {
        ul: this.property === 'color' ? 'colors colors--black' : 'sizes sizes--primery',
        li: this.property === 'color' ? 'colors__item' : 'sizes__item',
        label: this.property === 'color' ? 'colors__label' : 'sizes__label',
        input: this.property === 'color' ? 'colors__radio' : 'sizes__radio',
        span: this.property === 'color' ? 'colors__value' : 'sizes__value',
      };
    },
    colors() {
      return this.$store.getters.colors;
    },
  },
  emits: ['update:chosenProperty'],
  watch: {
    propertyValue() {
      this.$emit('update:chosenProperty', this.propertyValue);
    },
    chosenProperty: {
      handler(value) {
        this.propertyValue = value;
      },
      immediate: true,
    },
  },
  methods: {
    doStyle(value) {
      if (value === '#ffffff') return 'background-color: #e9e9e9;';
      if (value) return `background-color: ${value};`;
      return null;
    },
    searchColor(colorName) {
      return this.colors.find((c) => {
        const color = c.title.replaceAll('ё', 'е');
        return color === colorName;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.colors, .sizes {
  margin-bottom: 20px;
}
.form .colors__radio:checked~.colors__value::before {
  border-color: #fff;
}
</style>

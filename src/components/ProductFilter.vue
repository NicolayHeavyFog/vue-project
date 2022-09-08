<template>
  <h2 class="filter__title" ref="formTitle">Фильтры</h2>

  <form
    v-bind="$attrs"
    class="filter__form form"
    action="#"
    method="get"
    @submit.prevent="submit()"
    ref="form"
  >
    <fieldset class="form__block">
      <legend class="form__legend">Цена</legend>
      <label class="form__label form__label--price">
        <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom" />
        <span class="form__value">От</span>
      </label>
      <label class="form__label form__label--price">
        <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo" />
        <span class="form__value">До</span>
      </label>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Категория</legend>
      <label class="form__label form__label--select">
        <select
          class="form__select"
          name="category"
          v-model.number="currentCategoryId"
          @change="updateFilter()"
        >
          <option value="0">Все категории</option>
          <option :value="category.id" v-for="category in categories" :key="category.id">
            {{ category.title }}
          </option>
        </select>
      </label>
    </fieldset>

    <fieldset class="form__block">
      <legend class="form__legend">Цвет</legend>
      <ul class="colors">
        <li class="colors__item" v-for="currentColor in colors" :key="currentColor.id">
          <label class="colors__label">
            <input
              class="colors__radio sr-only"
              type="radio"
              :name="currentColor.title"
              :value="currentColor.id"
              v-model.number="currentColorId"
            />
            <span class="colors__value" :style="doStyle(currentColor.code)"> </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <fieldset class="form__block" v-for="prop in currentProps" :key="prop.id">
      <legend class="form__legend">{{ prop.title }}</legend>
      <ul class="check-list" v-if="prop">
        <li class="check-list__item" v-for="item in prop.availableValues" :key="item.value">
          <label class="check-list__label">
            <input
              class="check-list__check sr-only"
              type="checkbox"
              :name="item.value"
              :value="item.value"
              @change="setProp(prop.code, item.value)"
            />
            <span class="check-list__desc">
              {{ item.value }}
              <span>({{ item.productsCount }})</span>
            </span>
          </label>
        </li>
      </ul>
    </fieldset>

    <BaseButtonPrimary class="filter__submit" type="submit"> Применить </BaseButtonPrimary>

    <BaseButtonSecondary class="filter__reset" type="button" @click="reset()">
      Сбросить
    </BaseButtonSecondary>
  </form>
  <slot></slot>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { buttonCircle } from '@/animation/bubblingCircle';
import { animateFilterElements } from '@/animation/mainPage';
import BaseButtonPrimary from '@/components/BaseButtonPrimary.vue';
import BaseButtonSecondary from '@/components/BaseButtonSecondary.vue';

export default {
  components: { BaseButtonPrimary, BaseButtonSecondary },
  props: {
    priceFrom: {
      type: Number,
      require: true,
    },
    priceTo: {
      type: Number,
      require: true,
    },
    categoryId: {
      type: Number,
      require: true,
    },
    colorId: {
      type: Number,
      require: true,
    },
    categoryEntries: {
      require: true,
    },
  },
  emits: [
    'update:priceFrom',
    'update:priceTo',
    'update:categoryId',
    'update:colorId',
    'update:categoryEntries',
  ],
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColorId: 0,
      categoriesData: null,
      currentProps: null,
      currentPropsEntries: {},
    };
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    colorId(value) {
      this.currentColorId = value;
    },
    categoryEntries(value) {
      this.currentPropsEntries = value;
    },
  },
  methods: {
    buttonCircle,
    animateFilterElements,
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:colorId', this.currentColorId);
      this.$emit('update:categoryEntries', this.currentPropsEntries);
      console.log('submit');
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:colorId', 0);
      this.$emit('update:categoryEntries', {});
      this.currentProps = null;
      // this.currentPropsEntries = [];
    },
    loadCategories() {
      axios
        .get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => (this.categoriesData = response.data));
    },
    doStyle(code) {
      return `background-color: ${code};`;
    },
    updateFilter() {
      axios
        .get(`${API_BASE_URL}/api/productCategories/${this.currentCategoryId}`)
        .then((response) => {
          this.currentProps = response.data.productProps;
          this.currentPropsEntries = {};
        });
    },
    setProp(key, value) {
      const field = this.currentPropsEntries[key];
      if (field) {
        const indexElement = field.findIndex((element) => element === value);
        if (indexElement !== -1) field.splice(indexElement, 1);
        else field.push(value);
      } else {
        this.currentPropsEntries[key] = [value];
      }
    },
  },
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.$store.getters.colors;
    },
  },
  created() {
    this.loadCategories();
  },
  mounted() {
    const { formTitle, form } = this.$refs;
    this.animateFilterElements([formTitle, form]);
  },
};
</script>

<style scoped lang="scss">
.filter {
  &__title {
    background-color: #272727;
  }

  &__form {
    margin-bottom: 30px;
    background-color: #272727;
  }
}
</style>

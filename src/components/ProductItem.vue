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
        <li class="colors__item">
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" name="color-1" value="#73B6EA" checked="">
            <span class="colors__value" style="background-color: #73B6EA;">
            </span>
          </label>
        </li>
        <li class="colors__item">
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" name="color-1" value="#8BE000">
            <span class="colors__value" style="background-color: #8BE000;">
            </span>
          </label>
        </li>
        <li class="colors__item">
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" name="color-1" value="#222">
            <span class="colors__value" style="background-color: #222;">
            </span>
          </label>
        </li>
      </ul>
    </li>
</template>

<script>
export default {
  props: {
    product: {
      require: true,
      validator: (value) => {
        const props = ['image', 'title', 'price'];
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
};
</script>

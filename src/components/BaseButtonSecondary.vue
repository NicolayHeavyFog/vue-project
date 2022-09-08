<template>
  <button
    v-bind="$attrs"
    class="button button--second button__circle"
    @click="
      buttonCircle($event, $refs.circleButton);
    "
  >
    <span class="circle" ref="circleButton"></span>
    <slot></slot>
  </button>
</template>

<script>
import { buttonCircle } from '@/animation/bubblingCircle';

export default {
  data() {
    return {

    };
  },
  methods: {
    buttonCircle,
  },
};
</script>

<style scoped lang="scss">
.circle {
  display: none;
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
}

.button__circle {
  position: relative;
  overflow: hidden;

  &::before {
    z-index: 1000;
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
  }
}
</style>

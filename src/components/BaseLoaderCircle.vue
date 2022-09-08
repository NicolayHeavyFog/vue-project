<template>
  <div class="lds-dual-ring" v-bind="$attrs"></div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

/* .options__item .lds-dual-ring:after {
  border-color: #272727 transparent #272727 transparent;
} */
.pics__wrapper .lds-dual-ring:after,
.options__item .lds-dual-ring:after,
.catalog__list .lds-dual-ring:after,
.cart__item .lds-dual-ring:after {
  border-color: #272727 transparent #272727 transparent;
  margin: auto;
}
.pics__wrapper .lds-dual-ring,
.catalog__list .lds-dual-ring,
.cart__item .lds-dual-ring {
  display: flex;
  width: 100%;

  justify-content: center;
}

.catalog__list .lds-dual-ring,
.pics__wrapper .lds-dual-ring,
.catalog__list .lds-dual-ring {
  align-content: center;
  height: 100%;
}

.pics__wrapper .lds-dual-ring:after {
  width: 100px;
  height: 100px;
  border-width: 9px;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

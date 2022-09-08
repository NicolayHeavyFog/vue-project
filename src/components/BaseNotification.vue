<template>
  <Teleport to="#notification-target">
    <Transition name="notification-show" appear>
      <div class="notification"
      v-if="openNotification"
      tabindex="0"
      ref="notification"
      @mouseover="hoverNotification = true"
      @mouseleave="hoverNotification = false"
      @focusin="focusNotification = true"
      @focusout="focusNotification = false"
       >
      <div class="notification__wrapper">
        <BaseLoaderCircle v-if="loading"/>
        <div class="notification__content" v-if="!loading">
          <slot></slot>
        </div>
      </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import BaseLoaderCircle from '@/components/BaseLoaderCircle.vue';

export default {
  components: { BaseLoaderCircle },
  props: {
    finish: {
      require: true,
      type: Boolean,
    },
    loading: {
      require: true,
      type: Boolean,
    },
  },
  data() {
    return {
      addedStatus: false,
      hoverNotification: false,
      focusNotification: false,
    };
  },
  methods: {
    addHover() {
      if (!this.hoverNotification) this.hoverNotification = true;
    },
    removeHover() {
      if (this.hoverNotification) this.hoverNotification = false;
    },
  },
  computed: {
    openNotification() {
      return this.addedStatus
          || this.loading
          || this.hoverNotification
          || this.focusNotification;
    },
  },
  watch: {
    finish(value) {
      this.addedStatus = value;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.addedStatus = false;
        // this.$refs.notification.focus();
      }, 3000);
    },
  },
};
</script>

<style lang="scss">
  .notification {
    position: fixed;
    right: 30px;
    bottom: 30px;

    &__wrapper {
      min-width: 90px;
      min-height: 80px;
      background-color: #272727;
      padding: 10px;
    }

    &__content {
      width: 100%;
      min-height: 80px;
      font-size: 18px;
      line-height: 24px;
      color: #fff;
    }
  }

  .notification-show-enter-active {
    transition: transform 0.3s ease-in-out;
  }

  .notification-show-leave-active {
    transition: transform 0.3s ease-in-out;
  }

  .notification-show-enter-from,
  .notification-show-leave-to {
    transform: translateX(calc(100% + 50px));
  }

</style>

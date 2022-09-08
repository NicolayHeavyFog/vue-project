<template>
   <ul class="catalog__pagination pagination">
      <li class="pagination__item">
        <button href='#' class="pagination__link pagination__link--arrow" :class='{"pagination__link--disabled": page <= 1 }' :disabled="page <= 1" aria-label="Предыдущая страница" @click.prevent='paginate(page - 1)'>
          <svg width="8" height="14" fill="currentColor">
            <use xlink:href="#icon-arrow-left"></use>
          </svg>
        </button>
      </li>
      <li class="pagination__item" v-for='(pageNumber, index) in pages' :key='index' >
        <a href='#' class="pagination__link" :class="{'pagination__link--current': pageNumber === page}" @click.prevent='paginate(pageNumber)'>
          {{pageNumber}}
        </a>
      </li>
      <li class="pagination__item">
        <button class="pagination__link pagination__link--arrow" href="#" :class='{"pagination__link--disabled": page >= pages }' :disabled="page >= pages" aria-label="Следующая страница" @click.prevent='paginate(page + 1)' >
          <svg width="8" height="14" fill="currentColor">
            <use xlink:href="#icon-arrow-right"></use>
          </svg>
        </button>
      </li>
    </ul>
</template>

<script>
export default {
  props: {
    // page: {

    // }
    modelValue: {
      type: Number,
      require: true,
      validate: (value) => value < 1 && value > this.pages,
    },
    count: {
      type: Number,
      require: true,
      validate: (value) => value < 1,
    },
    perPage: {
      type: Number,
      require: true,
      validate: (value) => value < 1,
    },
  },
  computed: {
    page() {
      return Number(this.modelValue);
    },
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
    thresholdBottom() {
      if (this.page <= 1) return 'disabled';
      return false;
    },
    thresholdTop() {
      if (this.page >= this.pages) return 'disabled';
      return false;
    },
  },
  methods: {
    paginate(page) {
      // if (this.page < 0) { return; }
      // if (this.page > this.pages) return;
      // if (this.page === this.pages || this.page <= 0) return;
      // if (this.page <= 0) return;
      // console.log(page, '<= 1');
      // console.log(Boolean(page < this.pages), page, this.pages);
      this.$emit('update:modelValue', page);
    },
  },
};
</script>

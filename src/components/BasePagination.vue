<template>
   <ul class="catalog__pagination pagination">
      <li class="pagination__item">
        <a href='#' class="pagination__link pagination__link--arrow" :class='{"pagination__link--disabled": page < pages }' aria-label="Предыдущая страница" @click.prevent='paginate(page - 1)'>
          <svg width="8" height="14" fill="currentColor">
            <use xlink:href="#icon-arrow-left"></use>
          </svg>
        </a>
      </li>
      <li class="pagination__item" v-for='(pageNumber, index) in pages' :key='index' >
        <a href='#' class="pagination__link" :class="{'pagination__link--current': pageNumber === page}" @click.prevent='paginate(pageNumber)'>
          {{pageNumber}}
        </a>
      </li>
      <li class="pagination__item">
        <a class="pagination__link pagination__link--arrow" href="#" :class='{"pagination__link--disabled": page > 1}' aria-label="Следующая страница" @click.prevent='paginate(page + 1)'>
          <svg width="8" height="14" fill="currentColor">
            <use xlink:href="#icon-arrow-right"></use>
          </svg>
        </a>
      </li>
    </ul>
</template>

<script>
export default {
  props: {
    page: {
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
  model: {
    prop: 'page',
    event: 'paginate',
  },
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    paginate(page) {
      console.log(Boolean(page < this.pages), page, this.pages);
      this.$emit('paginate', page);
    },
  },
};
</script>

<template>
  <BaseFormField :title="title" :error="error">
    <input class="form__input" type="text" v-model="dataValue" :placeholder="placeholder" />
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixins';

export default {
  mixins: [formFieldMixin],
};
</script>

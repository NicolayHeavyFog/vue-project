module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    // '@vue/airbnb',
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // 'max-len': 'off',
    "max-len": ["error", { code: 350 }],
    "vuejs-accessibility/label-has-for": "off",
    // 'vue/no-deprecated-v-bind-sync': 'off',
    "vuejs-accessibility/form-control-has-label": "off",
    // 'vue/no-deprecated-filter': 'off',
    "no-return-assign": "off",
    // 'vue/no-deprecated-router-link-tag-prop': 'off',
    "vuejs-accessibility/click-events-have-key-events": "off",
    "no-plusplus": "off",
  },
};

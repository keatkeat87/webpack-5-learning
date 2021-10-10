module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-prettier/recommended'],
  ignoreFiles: ['dist/*', 'wwwroot/assets/*'],
  plugins: ['stylelint-scss'],
  rules: {
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        // note 解忧: 之前需要，现在好像不需要了
        // ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'prettier/prettier': [
      true,
      {
        singleQuote: true,
        endOfLine: 'auto', // refer: https://stackoverflow.com/questions/53516594/why-do-i-keep-getting-delete-cr-prettier-prettier
      },
    ],
  },
};

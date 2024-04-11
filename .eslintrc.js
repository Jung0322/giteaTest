module.exports = {
  root: true,
  // TODO : jquery를 전역에서 사용할 수 있도록 하는 설정 추가
  globals: {
    "$": true,
    "jQuery": true
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [ 'eslint-config-alloy/vue' ],
  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    // we should always disable console logs and debugging in production
    // "vue/component-name-in-template-casing": ["error", "PascalCase"],
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    // @fixable 들여 쓰기는 두 칸으로 바꿔야합니다.
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    'complexity': 0,
    //  0 = off, 1 = warn, 2 = error
    'no-undef-init': 2,
    'no-trailing-spaces': 0, // 후행공백
    'no-undefined': 0,
    'no-void': 2, // Disallow use of the void operator
    'no-var': 0,
    'no-unused-vars': 0, // Disallow Unused Variables
    'no-param-reassign': 0, // Disallow Reassignment of Function Parameters
    "space-before-function-paren": 0,
    'no-return-assign': 0, //
    'curly': 0, // if {} 를 써야 하는지 여부
    'no-empty-function': 0,
    'quotes': 0,
    'semi': 0,
    'no-new': 0,
    'object-curly-newline': 0,
    'guard-for-in': 0,
    'max-nested-callbacks': ["error", 5],
  }
}

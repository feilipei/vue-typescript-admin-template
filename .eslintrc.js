module.exports = {
  // 项目级别eslint 配置
  root: true,
  // 环境与全局变量
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // 解析器配置参数
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  // 插件
  plugins: [
    'vue'
  ],
  // 规则设置
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': [2, 'never'],
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    'vue/camelcase': 'error',
    'vue/comma-dangle': 'error',
    'vue/component-name-in-template-casing': 'error',
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'error',
    'vue/match-component-file-name': 'error',
    'vue/object-curly-spacing': 'error'
  },
  // 扩展：直接使用别人已写好的lint规则
  'extends': [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript'
  ]
}

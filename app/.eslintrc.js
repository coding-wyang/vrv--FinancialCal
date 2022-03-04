module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ["error", "windows"], //默认unix 换行符
    'no-alert': 2, // 禁止使用alert confirm prompt *
    camelcase: 2, // 强制驼峰法命名 *
    quotes: [1, 'single'], // 使用单引号 *
    curly: [2, 'all'], // 必须使用 if(){} 中的{} *
    eqeqeq: 2, // 必须使用全等 *
    indent: [2, 2, { SwitchCase: 1, VariableDeclarator: 'first' }], // 缩进风格
    semi: [2, 'always'], // 语句强制分号结尾
    'semi-style': ['error', 'last'], // 此规则强制分号位于行尾
    'max-params': ['error', 3], // 函数参数最多有3个
    'valid-typeof': 'error', // 强制将typeof表达式与有效的字符串文字进行比较
    'require-await': 'error', // async 函数里面必须有await
    'no-useless-return': 'error', // 禁止多余的return语句
    'dot-notation': ['error', { allowKeywords: false }], // 使用点符号（foo.bar）来访问属性
    'no-const-assign': 2, // 禁止修改 const 声明的变量
    'no-constant-condition': ["error", { "checkLoops": false }], //不允许使用常量表达式,允许循环中的常量表达式
    'comma-dangle': ["error", "only-multiline"],
    'import/extensions': ['error', 'always', { js: 'always', ts: 'never', tsx: 'never', vue: 'always' }], // 文件带扩展名
    'max-len': ["error", { "code": 150 , "ignoreComments": true}], // 规定每行的最大字符为150 
    'radix': ["error", "as-needed"], // 不强制执行radix 默认10进制
    /**
     *  空格相关
     */
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格 *
    'space-before-blocks': [2, 'always'], // 不以新行开始的块{前面要有空格
    'key-spacing': [2, { beforeColon: false, afterColon: true }], // 此规则在对象字面量属性中强制在冒号周围放置空格
    'keyword-spacing': ['error', { before: true, after: true }], // 围绕关键词使用的空格,前面有,后面没有
    'no-mixed-spaces-and-tabs': [2, false], // 禁止混用tab和空格
    'no-multi-spaces': 2, // 不能用多余的空格 *
    'computed-property-spacing': 2, // 计算属性[]内禁止空格 obj[ i] => obj[i]
    'comma-spacing': 2, // 强制逗号后有至少一个空格
    'object-curly-newline': [2, { multiline: true, consistent: true }], // 大括号换行
    'switch-colon-spacing': 2, // switch case冒号前后空格
    'array-bracket-spacing': 2, // 强制数组[]括号前后不空格
    'space-in-parens': [2, 'never'], // 强制小括号()前后不允许空格
    'semi-spacing': ['error', { before: false, after: false }], // 分号前后不要空格

    /**
     *  换行相关
     */
    'no-multiple-empty-lines': [1, { max: 1 }], // 空行最多不能超过2行
    'newline-after-var': [0], // 变量声明后不需要空一行
    'padded-blocks': ['error', 'never'], // 块语句内行首行尾不要空一行
    /**
     *  函数相关
     */
    'arrow-body-style': ['error', 'as-needed'], // 箭头函数体周围强制使用大括号
    'arrow-parens': ['error', "as-needed", { "requireForBlockBody": true }], // 箭头函数参数强制加括号
    'arrow-spacing': 'error', // 箭头函数箭头前后加空格
    'func-call-spacing': ['error', 'never'], // 调用函数函数名称和左括号之间禁止空格

    /**
     * 关闭部分配置
     */
    "no-bitwise": 'off', // 关闭不允许使用位运算符
    "no-plusplus": 'off', //关闭不允许使用++ --运算符
    "no-underscore-dangle": "off", //允许标识符使用_
    "no-unused-expressions":"off", //允许对程序状态没有影响的表达式
    'no-var': 'off', // 允许var
    'eol-last': 'off', //关闭强制文件以换行符结尾
    'prefer-const': 'off', // 关闭强制声明为const
    'no-new': 'off', // 关闭强制声明为const
    'no-undef': 'off', // 关闭no-undef
    'guard-for-in': 'off', // 关闭guard-for-in(限制了for in 使用)
    'no-restricted-syntax': 'off', // 关闭禁止try catch in 等操作
    'consistent-return':'off', // 允许返回不同的类型
    'no-param-reassign': 'off', // 允许改变参数
    'global-require': 'off', // 关闭强制顶部引入require
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': 'off', // 关闭依赖检查
    "prefer-destructuring": 'off', // 关闭解构限制
    'no-continue': 'off', // 允许使用continue
    'vue/require-prop-type-constructor': 'off', // 允许vue中 prop属性没有构造函数

    'spaced-comment': ['error', 'always', { // 注释风格
      line: {
        markers: ['/'],
        exceptions: ['-', '+', '*'],
      },
      block: {
        markers: ['!'],
        exceptions: ['*'],
        balanced: true,
      },
    }],
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};

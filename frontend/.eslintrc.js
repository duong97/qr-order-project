module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        '@vue/typescript/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        // Chỗ này mày thêm rule tùy ý, ví dụ:
        'no-console': 'warn',
        'no-debugger': 'warn',
    },
};

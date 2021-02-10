module.exports = {
    env: {
        "react-native/react-native": true,
    },
    extends: "airbnb",
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    parser: "babel-eslint",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: [
        "react",
        "react-native",
    ],
    rules: {
    }
};

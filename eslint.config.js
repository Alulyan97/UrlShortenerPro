const js = require("@eslint/js");
const jest = require("eslint-plugin-jest");

module.exports = [
    js.configs.recommended,
    // Добавляем Jest конфиг для всех тестовых файлов
    {
        files: ["**/*.test.js", "**/*.spec.js", "tests/**/*.js"],
        ...jest.configs["flat/recommended"],
    },
    // Основной конфиг для остальных файлов
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                setImmediate: "readonly",
                console: "readonly",
                process: "readonly",
                require: "readonly",
                module: "readonly",
                __dirname: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "semi": ["warn", "always"],
            "quotes": ["warn", "double"],
            "indent": ["warn", 4]
        }
    }
];
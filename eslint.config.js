const js = require("@eslint/js");

module.exports = [
    js.configs.recommended,
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
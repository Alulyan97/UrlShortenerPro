const { body } = require("express-validator");

const validateRegister = [
    body("email")
        .isEmail().withMessage("Введите корректный email")
        .normalizeEmail(),
    
    body("password")
        .isLength({ min: 8 }).withMessage("Пароль должен быть минимум 8 символов")
        .matches(/[A-Z]/).withMessage("Пароль должен содержать хотя бы одну заглавную букву")
        .matches(/[a-z]/).withMessage("Пароль должен содержать хотя бы одну строчную букву")
        .matches(/[0-9]/).withMessage("Пароль должен содержать хотя бы одну цифру")
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Пароль должен содержать хотя бы один специальный символ")
];

const validateLogin = [
    body("email")
        .isEmail().withMessage("Введите корректный email")
        .normalizeEmail(),
    
    body("password")
        .notEmpty().withMessage("Пароль обязателен")
];

module.exports = { validateRegister, validateLogin };
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const db = require("../config/db");
const validate = require("../middleware/validate");

const validateRegister = [
    body('email')
        .isEmail().withMessage('Введите корректный email')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 }).withMessage('Пароль должен быть минимум 8 символов')
        .matches(/[A-Z]/).withMessage('Пароль должен содержать хотя бы одну заглавную букву')
        .matches(/[a-z]/).withMessage('Пароль должен содержать хотя бы одну строчную букву')
        .matches(/[0-9]/).withMessage('Пароль должен содержать хотя бы одну цифру')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Пароль должен содержать хотя бы один специальный символ')
];

const validateLogin = [
    body('email')
        .isEmail().withMessage('Введите корректный email')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Пароль обязателен')
];

// Регистрация нового пользователя
router.post("/register", validateRegister, validate, async (req, res) => {
    try {
        const { email, password } = req.body;

        const emailVerify = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (emailVerify.rows.length > 0) {
            return res.status(400).json({ error: "Email уже используется" });
        }

        const hash = await bcrypt.hash(password, 10); 

        const result = await db.query(
            `INSERT INTO users (email, password_hash)
             VALUES ($1, $2)
             RETURNING id, email, created_at`,
            [email, hash]
        );

        const token = jwt.sign(
            { userId: result.rows[0].id },    
            process.env.JWT_SECRET,        
            { expiresIn: "10d" }            
        );

        res.status(201).json({
            message: "Регистрация прошла успешно",
            user: result.rows[0],
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Вход пользователя
router.post("/login", validateLogin, validate, async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Неверный email или пароль" });
        }

        const user = userResult.rows[0];

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: "Неверный email или пароль" });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        );

        res.json({
            message: "Вход выполнен успешно",
            user: {
                id: user.id,
                email: user.email,
                created_at: user.created_at
            },
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


module.exports = router;
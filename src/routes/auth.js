const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const db = require("../config/db");
const validate = require("../validation/validate");
const { validateRegister, validateLogin } = require("../validation/authValidators");
const authMiddleware = require("../middleware/authMiddleware");
const { AlreadyExistsError, NotAuthorizedError, NotFoundError } = require("../errorHandling/error");
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Email уже занят
 *
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешный вход
 *       401:
 *         description: Неверные данные
 *
 * /api/auth/me:
 *   get:
 *     summary: Информация о текущем пользователе
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *       401:
 *         description: Не авторизован
 */

router.post("/register", validateRegister, validate, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const emailVerify = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (emailVerify.rows.length > 0) {
            throw new NotAuthorizedError("Неверный email или пароль");        
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
        next(err)
    }
});

// Вход пользователя
router.post("/login", validateLogin, validate, async (req, res, next) => {
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
            throw new NotAuthorizedError("Неверный email или пароль");        
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
        next(err)
    }
});

// Информация о пользователе
router.get("/me", authMiddleware, async (req, res, next) => {
    try{
        const result = await db.query(
            "SELECT id, email, created_at FROM users WHERE id = $1",
            [req.userId]
        );

        if(result.rows.length === 0) {
            throw new NotFoundError("Пользователь не найден");
        }

        res.json({ user: result.rows[0]})
    } catch (err) {
        next(err)
    }
})

module.exports = router;
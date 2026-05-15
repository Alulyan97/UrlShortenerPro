const rateLimit = require("express-rate-limit");

//Для API
const apiLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        status: 429,
        message: "Слишком много запросов, попробуйте позже"
    }
});

//Для логина
const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        status: 429,
        message: "Слишком много попыток входа, попробуйте позже"
    }
});

module.exports = {apiLimit, loginLimit};
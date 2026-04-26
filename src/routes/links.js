const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const linkModel = require("../models/linkModel");
const { generateShortCode } = require("../services/linkServices");
const analyticsController = require("../controllers/analyticsControllers");

router.use(authMiddleware);

// Создание ссылки
router.post("/", async (req, res) => {
    try {
        const { originalUrl } = req.body;
        const userId = req.userId;

        if (!originalUrl) {
            return res.status(400).json({ error: "URL обязателен" });
        }

        let shortCode;
        do {
            shortCode = generateShortCode();
        } while (await linkModel.findByShortCode(shortCode));

        const link = await linkModel.create(userId, originalUrl, shortCode);

        res.status(201).json({
            link: {
                shortCode: link.short_code,
                originalUrl: link.original_url,
                shortUrl: `${req.protocol}://${req.get("host")}/${link.short_code}`
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Список ссылок пользователя
router.get("/", async (req, res) => {
    try {
        const links = await linkModel.findByUserId(req.userId);

        const formattedLinks = links.map(link => ({
            shortCode: link.short_code,
            originalUrl: link.original_url,
            shortUrl: `${req.protocol}://${req.get("host")}/${link.short_code}`
        }));

        res.json({ links: formattedLinks });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// Удаление ссылки
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const deleted = await linkModel.delete(id, userId);

        if (!deleted) {
            return res.status(404).json({ error: "Ссылка не найдена или нет доступа" });
        }

        res.json({ message: "Ссылка удалена" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

//Аналитика ссылок
router.get("/:shortCode/analytics", analyticsController.analytics);


module.exports = router;
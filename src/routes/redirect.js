const express = require("express");
const router = express.Router();
const redirectController = require("../controllers/redirectController");

/**
 * @swagger
 * /{shortCode}:
 *   get:
 *     summary: Переход по короткой ссылке
 *     tags: [Redirect]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Редирект на оригинальный URL
 *       404:
 *         description: Ссылка не найдена
 */

router.get("/:shortCode", redirectController.redirect);

module.exports = router;
const linkModel = require("../models/linkModel");

const controller = {
    async redirect (req, res) {
        try {
            const { shortCode } = req.params;

            const link = await linkModel.findByShortCode(shortCode);

            if(!link) {
                return res.status(404).json({ error: "Ссылка не найдена"});
            }

            return res.redirect(302, link.original_url);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    }
}

module.exports = controller;
const linkModel = require("../models/linkModel");
const analyticsModel = require("../models/analyticsModel");

const analyticsController = {
    async analytics(req, res) {
        try {
            const { shortCode } = req.params;
            const days = parseInt(req.query.days) || 7;

            // Поиск ссылки
            const link = await linkModel.findByShortCode(shortCode);
            if(!link) {
                return res.status(404).json({error: "Ссылка не найдена"});
            }
            // Поверка владельца
            if(link.user_id !== req.userId) {
                return res.status(403).json({error: "Нет доступа"})
            }

            //Сбор статиастики
            const totalClicks = await analyticsModel.totalClicks(link.id);
            const clicksByDay = await analyticsModel.clicksByDay(link.id, days);
            const topCountries = await analyticsModel.topCountries(link.id);

            res.json({
                shortCode: link.short_code,
                originalUrl: link.original_url,
                totalClicks: totalClicks,
                days: days,
                clicksByDay: clicksByDay,
                topCountries:topCountries
            })
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Ошибка сервера" });
        }
    }
};

module.exports = analyticsController;
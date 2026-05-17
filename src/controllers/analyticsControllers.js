const linkModel = require("../models/linkModel");
const analyticsModel = require("../models/analyticsModel");
const { NotFoundError, NoAccesError } = require("../errorHandling/error");

const analyticsController = {
    async analytics(req, res, next) {
        try {
            const { shortCode } = req.params;
            const days = parseInt(req.query.days) || 7;

            // Поиск ссылки
            const link = await linkModel.findByShortCode(shortCode);
            if(!link) {
                throw new NotFoundError("Ссылка не найдена");
            }
            // Поверка владельца
            if(link.user_id !== req.userId) {
                throw new NoAccesError("Нет доступа");
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
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = analyticsController;
const db = require ("../config/db");

const analyticsModel = {
    async create(linkId, ipAddress, userAgent, referer, country, city) {
        const result = await db.query(
            `INSERT INTO analytics (link_id, ip_address, user_agent, referer, country, city)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`, 
            [linkId, ipAddress, userAgent, referer, country, city]
        );
        return result.rows[0];
    },
//общее количество кликов по ссылке
        async totalClicks(linkId) {
        const result = await db.query(
            "SELECT COUNT(*) as total FROM analytics WHERE link_id = $1",
            [linkId]
        );
        return parseInt(result.rows[0].total);
    },

// Клики по дням
    async clicksByDay(linkId, days = 7) {
        const result = await db.query(
            `SELECT DATE(clicked_at) as day, COUNT(*) as count
            FROM analytics
            WHERE link_id = $1 AND clicked_at > NOW() - INTERVAL '1 day' * $2
            GROUP BY day
            ORDER BY day ASC`,
            [linkId, days]
        );
        return result.rows;
    },

//Топ стран
async topCountries(linkId) {
        const result = await db.query(
            `SELECT country, COUNT(*) as count 
            FROM analytics
            WHERE link_id = $1 
            GROUP BY country
            ORDER BY count DESC
            LIMIT 5`,
            [linkId]
        );
        return result.rows;
    }
}

module.exports = analyticsModel;
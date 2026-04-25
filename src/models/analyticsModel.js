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
    }
}

module.exports = analyticsModel;
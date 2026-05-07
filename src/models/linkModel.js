const db = require("../config/db");

const linkModel = {
    // Создание ссылки
    async create(userId, originalUrl, shortCode) {
        const result = await db.query(
            `INSERT INTO links (user_id, original_url, short_code)
             VALUES ($1, $2, $3)
             RETURNING id, short_code, original_url, created_at`,
            [userId, originalUrl, shortCode]
        );
        return result.rows[0];
    },

    // Найти ссылку по короткому коду 
    async findByShortCode(shortCode) {
        const result = await db.query(
            "SELECT * FROM links WHERE short_code = $1",
            [shortCode]
        );
        return result.rows[0] || null;
    },

    // Получить все ссылки пользователя
    async findByUserId(userId) {
        const result = await db.query(
            `SELECT id, short_code, original_url, created_at 
             FROM links 
             WHERE user_id = $1 
             ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    },

    // Удаление ссылки
    async delete(id, userId) {
        const result = await db.query(
            "DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, userId]
        );
        return result.rows[0] || null;
    },

//Пагинация
    async paginated(userId, limit = 5, page = 1) {
        const viewed = (page - 1) * limit;

        const result = await db.query(
            `SELECT id, short_code, original_url, created_at
            FROM links
            WHERE user_id = $1
            ORDER BY created_at DESC
            limit $2 OFFSET $3`,
            [userId, limit, viewed]
        );
        return result.rows;
    },

  //Общий подсчет ссылок
    async totalLinks(userId) {
        const result = await db.query(
            "SELECT COUNT(*) as total FROM links WHERE user_id = $1",
            [userId]
        );
        return parseInt(result.rows[0].total);
    }
};

module.exports = linkModel;
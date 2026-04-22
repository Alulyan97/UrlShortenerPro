const db = require("../src/config/db");

// Создание ссылки
const linkModel = {
    // Создание ссылки
    async create(userId, originalUrl, shortCode) {
        const result = await db.query(
            `
            INSERT INTO links (user_id, original_url, short_code)
            VALUES ($1, $2, $3)
            RETURNING id, short_code, original_url, created_at`,
            [userId, originalUrl, shortCode]
        );
        return result.rows[0];
    },

    // Найти ссылку по короткому коду 
    async linkSearch(shortcode){
     const result = await db.query(
        "SELECT * FROM links WHERE short_code = $1",
        [shortCode]
     )
     return result.rows[0] || null;
    },

    // Удалени ссылки
    async delete(id, userId) {
        const result = await db.query(
            "DELETE FROM links WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, userId]
        );
        return result.rows[0] || null;
    }

}

module.exports = linkModel;
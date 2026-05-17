require("dotenv").config();
const { Pool } = require ("pg");

// Подключение к бд
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Проверка работы бд
const testConnection = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("База данных подключена");
    } catch (err) {
        console.error("База данных недоступна", err.message);
    }
};

testConnection();

module.exports = pool;
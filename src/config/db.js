require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("render.com") 
        ? { rejectUnauthorized: false } 
        : false
});

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
const redis = require("redis");

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on("error", (err) => {
    console.error("Ошибка подключения к Redis:", err);
});

client.on("connect", () => {
    console.log("Redis подключен");
});

(
    async () => {
        await client.connect();
    }
)();

module.exports = client;
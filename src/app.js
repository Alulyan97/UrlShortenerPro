const express = require ("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swagger = require("./swagger");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const linkRoutes = require("./routes/links");
const redirect = require("./routes/redirect");
const errorMiddleware = require("./middleware/errorMiddleware");

app.use(express.json());

// Подключение роутов
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use("/", redirect);

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({
        success: false,
        status: 404,
        message: "Маршрут не найден",
        timestamp: new Date().toISOString()
    });
});

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Привет Экспресс")
});

app.listen(3000, () => {
    console.log("Сервер запущен на http://localhost:3000");
    console.log("Swagger документация: http://localhost:3000/api-docs");
});
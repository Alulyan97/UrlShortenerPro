const express = require("express");
const app = express();
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swagger = require("./swagger");
const { apiLimit, loginLimit } = require("./errorHandling/rateLimiter");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const linkRoutes = require("./routes/links");
const redirect = require("./routes/redirect");
const errorMiddleware = require("./middleware/errorMiddleware");

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static("public"));

// Rate limit только для API
app.use("/api", apiLimit);
app.use("/api/auth/login", loginLimit);

// API роуты
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// Личный кабинет
app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

// Редирект по короткому коду
app.use("/", redirect);

// 404 для API
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        status: 404,
        message: "Маршрут не найден",
        timestamp: new Date().toISOString()
    });
});

app.use(errorMiddleware);

app.listen(3000, () => {
    console.log("Сервер запущен на http://localhost:3000");
    console.log("Swagger документация: http://localhost:3000/api-docs");
});

module.exports = app;
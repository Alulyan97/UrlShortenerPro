const express = require ("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swagger = require("./swagger");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const linkRoutes = require("./routes/links");
const redirect = require("./routes/redirect");

app.use(express.json());

// Подключение роутов
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use("/", redirect);

app.get("/", (req, res) => {
    res.send("Привет Экспресс")
});

app.listen(3000);
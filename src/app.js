const express = require ("express");
const app = express();

require("dotenv").config();

const authRoutes = require("./routes/auth");
const linkRoutes = require("./routes/links");
const redirect = require("./routes/redirect");

app.use(express.json());

// Подключение роутов
app.use("/api/auth", authRoutes),
app.use("/api/links", linkRoutes),
app.use("/", redirect),

app.get("/", (req, res) => {
    res.send("Привет Экспресс")
});

app.listen(3000);
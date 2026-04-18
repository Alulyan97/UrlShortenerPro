const express = require ("express");
const app = express();

require("dotenv").config();

const authRoutes = require("./routes/auth");

app.use(express.json());

// Подключение роутов
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("Привет Экспресс")
});

app.listen(3000);
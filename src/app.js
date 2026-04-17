const express = require ("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Привет Экспресс")
});

app.listen(3001);
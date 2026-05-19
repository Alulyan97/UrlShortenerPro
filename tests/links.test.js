const request = require("supertest");
const app = require("../src/app");

describe("Ссылки", () => {

    let token;
    let shortCode;

    beforeAll(async () => {
        // Регистрация
        const email = `test${Date.now()}@test.com`;
        await request(app)
            .post("/api/auth/register")
            .send({ email, password: "Test123!" });

        // Вход
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({ email, password: "Test123!" });

        token = loginRes.body.token;
    });

    // Положительные тесты
    test("Ссылка с токеном", async () => {
        const res = await request(app)
            .post("/api/links")
            .set("Authorization", `Bearer ${token}`)
            .send({ originalUrl: "https://github.com" });

        expect(res.status).toBe(201);
        expect(res.body.link).toHaveProperty("shortCode");
        expect(res.body.link).toHaveProperty("shortUrl");

        shortCode = res.body.link.shortCode;
    });

    test("Список ссылок с пагинацией", async () => {
        const res = await request(app)
            .get("/api/links?page=1&limit=5")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("links");
        expect(res.body).toHaveProperty("pagination");
        expect(res.body.pagination).toHaveProperty("total");
        expect(res.body.pagination).toHaveProperty("pages");
    });

    test("Редирект", async () => {
        const res = await request(app)
            .get(`/${shortCode}`);

        expect(res.status).toBe(302);
    });

    test("Аналитика", async () => {
        const res = await request(app)
            .get(`/api/links/${shortCode}/analytics?days=7`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("totalClicks");
        expect(res.body).toHaveProperty("clicksByDay");
    });

    // Отрицательные тесты
    test("Создание ссылки без токена", async () => {
        const res = await request(app)
            .post("/api/links")
            .send({ originalUrl: "https://github.com" });

        expect(res.status).toBe(401);
    });

    test("Создание ссылки без URL", async () => {
        const res = await request(app)
            .post("/api/links")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(res.status).toBe(400);
    });

    test("Удаление ссылки которая несуществует", async () => {
        const res = await request(app)
            .delete("/api/links/9999")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });

    test("Редирект по несуществующему коду", async () => {
        const res = await request(app)
            .get("/blabla");

        expect(res.status).toBe(404);
    });

    test("Аналитика по несуществующей ссылке", async () => {
        const res = await request(app)
            .get("/api/links/blabla/analytics")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
    });
});
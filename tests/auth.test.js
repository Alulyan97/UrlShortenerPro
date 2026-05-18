const request = require("supertest");
const app = require("../src/app");

describe("Аутентификация", () => {

    // Генерация email
    let testEmail;

    beforeAll(() => {
        testEmail = `test${Date.now()}@test.com`;
    });

    // Положительные тесты
    test("Успешная регистрация", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: testEmail, password: "Test123!" });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("token");
        expect(res.body.user).toHaveProperty("email");
    });

    test("Успешный вход", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: testEmail, password: "Test123!" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    // Отрицательные тесты
    test("Регистрация с занятым email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: testEmail, password: "Test123!" });

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    test("Регистрация с коротким паролем", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "new@test.com", password: "123" });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("errors");
    });

    test("Регистрация без email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ password: "Test123!" });

        expect(res.status).toBe(400);
    });

    test("Вход с неверным паролем", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: testEmail, password: "WrongPass123!" });

        expect(res.status).toBe(401);
    });

    test("Вход с несуществующим email", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "nosuchuser@test.com", password: "Test123!" });

        expect(res.status).toBe(401);
    });

});
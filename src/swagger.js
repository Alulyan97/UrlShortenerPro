const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "UrlShortener Pro API",
            version: "1.0.0",
            description: "Сервис сокращения ссылок с аналитикой",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Локальный сервер",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
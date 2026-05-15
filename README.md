# UrlShortenerPro

Сервис сокращения ссылок с аналитикой переходов.

## Что есть в проекте

- Регистрация и вход (JWT токены)
- Создание коротких ссылок
- Пагинация списка ссылок
- Статистика переходов (по дням, странам)
- Кэширование в Redis
- Защита от брутфорса (rate limiting)
- Единый формат ошибок
- Документация API (Swagger)
- Два режима запуска (Docker / локально)

## С помощью чего реализовано

- Node.js, Express
- PostgreSQL, Redis
- JWT (jsonwebtoken, bcrypt)
- express-validator, express-rate-limit
- node-pg-migrate
- geoip-lite
- swagger-jsdoc, swagger-ui-express
- Docker, Docker Compose

## Структура проекта
src/
├── config/ # Подключение к БД, Redis
├── controllers/ # Редирект, аналитика
├── errorHandling/ # Классы ошибок, rate limiter
├── middleware/ # JWT-проверка, валидация, обработка ошибок
├── models/ # SQL-запросы к БД
├── routes/ # Роуты API
├── services/ # Генерация кода, сохранение кликов
├── validation/ # Правила валидации
├── app.js # Точка входа
└── swagger.js # Конфигурация Swagger


## Быстрый старт

### Полностью в Docker

git clone https://github.com/Alulyan97/UrlShortenerPro.git
cd urlshortener-pro
copy .env.example .env
docker-compose up -d
docker-compose exec app npm run migrate up

Сервер запустится на http://localhost:3000.

### БД и Redis в Docker, локально

git clone https://github.com/Alulyan97/UrlShortenerPro.git
cd urlshortener-pro
copy .env.example .env
npm install
docker-compose -f docker-compose.dev.yml up -d
npm run migrate up
npm run dev

## API

### Аутентификация

POST /api/auth/register - Регистрация
POST /api/auth/login - Вход
GET /api/auth/me - Профиль 

### Ссылки

POST /api/links - Создать ссылку (требует токен)
GET /api/links?page=1&limit=10 - Список с пагинацией (требует токен)
DELETE /api/links/:id - Удалить ссылку (требует токен)
GET /api/links/:code/analytics?days=7 - Статистика (требует токен)

### Редирект

GET /:shortCode - Переход по ссылке

## Обработка ошибок

Все ошибки возвращаются в едином формате:

{
  "success": false,
  "status": 404,
  "message": "Ссылка не найдена",
  "timestamp": "2026-05-16T12:00:00.000Z"
}

## Документация

После запуска открыть http://localhost:3000/api-docs

## Переменные окружения (.env)

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=urlshortener
JWT_SECRET=ваш_секретный_ключ
JWT_REFRESH_SECRET=ваш_рефреш_ключ
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/urlshortener
DATABASE_URL_DOCKER=postgresql://postgres:postgres@postgres:5432/urlshortener
REDIS_URL=redis://localhost:6379
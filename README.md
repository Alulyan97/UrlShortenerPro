# UrlShortener Pro

Сервис сокращения ссылок с аналитикой переходов.

## Возможности

- Регистрация и вход (JWT токены)
- Создание коротких ссылок
- Статистика переходов (по дням, странам)
- Кэширование в Redis
- Полная Docker-контейнеризация

## Технологии

| Категория | Стек |
|-----------|------|
| Backend | Node.js, Express |
| База данных | PostgreSQL |
| Кэш | Redis |
| Аутентификация | JWT (jsonwebtoken, bcrypt) |
| Валидация | express-validator |
| Миграции | node-pg-migrate |
| Геолокация | geoip-lite |
| Контейнеризация | Docker, Docker Compose |

## Структура проекта

src/
├── config/ # Подключение к БД и Redis
├── controllers/ # Логика обработки запросов
├── middleware/ # JWT-проверка, валидация
├── models/ # SQL-запросы к БД
├── routes/ # Роуты API
├── services/ # Бизнес-логика
├── validation/ # Правила валидации
└── app.js # Точка входа

## Быстрый старт

# 1. Клонировать
git clone https://github.com/Alulyan97/UrlShortenerPro.git
cd urlshortener-pro

# 2. Настроить .env
cp .env.example .env

# 3. Запустить
docker-compose up -d

# 4. Применить миграции
docker-compose exec app npm run migrate up

Сервер запустится на http://localhost:3000.

API
Аутентификация

POST	/api/auth/register	Регистрация
POST	/api/auth/login	Вход
GET	    /api/auth/me	Профиль (требует токен)

Ссылки

POST	/api/links	Создать ссылку (требует токен)
GET  	/api/links	Список ссылок (требует токен)
DELETE	/api/links/:id	Удалить ссылку (требует токен)
GET	    /api/links/:code/analytics	Статистика (требует токен)

Редирект

GET	/:shortCode	Переход по ссылке
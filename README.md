# AviaTickets Junior

Учебный fullstack-проект сайта продажи авиабилетов в стиле junior/student.

## Что внутри
- React + Vite frontend
- Node.js + Express backend
- PostgreSQL (подходит для запуска и просмотра через pgAdmin 4)
- JWT авторизация
- Роли: `user` и `admin`
- CRUD рейсов для админа
- Бронирование билетов для пользователя
- История бронирований
- Простой чат поддержки через socket.io

## Быстрый старт

### 1. База данных PostgreSQL
Создайте базу, например `aviatickets_db`, и выполните SQL из файла:

- `database/init.sql`

Этот файл можно открыть и выполнить через pgAdmin 4.

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

Создайте `.env` по примеру `.env.example`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Тестовые аккаунты
После запуска SQL:
- admin: `admin@example.com` / `admin123`
- user: `user@example.com` / `user123`

## Основные страницы
- `/` — поиск и список рейсов
- `/login` — вход
- `/register` — регистрация
- `/my-bookings` — мои брони
- `/support` — чат поддержки
- `/admin` — админка

## Что можно улучшить
- оплата
- фильтры по пересадкам
- email уведомления
- загрузка авиакомпаний и аэропортов из отдельных таблиц
- графики и отчёты в админке

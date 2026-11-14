# simple-architecture-backend

Backend для TV Shows Explorer (frontend — репозиторий `simple-architecture`): NestJS 12,
данные — [TVmaze API](https://www.tvmaze.com/api).

- кеш ответов TVmaze на 5 минут (обычный объект в памяти);
- пагинация и фильтр по жанрам для каталога и поиска;
- избранное (в памяти процесса, без БД).

## Запуск

```bash
npm install
npm run start:dev    # http://localhost:3000/api
```

Frontend в dev-режиме проксирует `/api` сюда — запускайте оба проекта.

Переменные окружения (необязательны): `PORT` (3000), `TVMAZE_API_URL` (`https://api.tvmaze.com`).

## API

| Запрос | Описание |
|---|---|
| `GET /api/shows?page=1&genre=Drama` | страница каталога (страница индекса TVmaze), жанр — внутри страницы |
| `GET /api/shows/search?q=girls&page=1&genre=Drama` | поиск, по 3 на страницу |
| `GET /api/shows/:id` | сериал с актёрами |
| `GET /api/favorites` | избранное, новые первыми |
| `POST /api/favorites/:id/toggle` | добавить или убрать; ответ `{ isFavorite, show }` |

## Проверки

```bash
npm run lint && npm run build && npm test && npm run test:e2e
```

Архитектура — в [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

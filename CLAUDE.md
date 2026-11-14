# CLAUDE.md

Backend учебного проекта «каталог сериалов» на NestJS 12. Frontend — отдельный репозиторий
в соседней папке `../simple-architecture` (React + Vite, проксирует `/api` сюда).
Главная ценность — **соблюдение архитектуры** (Simple Architecture), а не количество фич.

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — правила слоёв, структура, кеш, ошибки. Обязательны.
- [AGENTS.md](AGENTS.md) — заметки Nest CLI о версии Nest 12 (ESM, `.js` в импортах, Vitest).

## Что делает

Ходит в TVmaze, кеширует его ответы на 5 минут, делает пагинацию и фильтр по жанрам,
хранит избранное. Всё — в памяти процесса, без БД.

| Запрос | Таска |
|---|---|
| `GET /api/shows?page&genre` | `getCatalogPage` |
| `GET /api/shows/search?q&page&genre` | `searchShows` |
| `GET /api/shows/:id` | `getShowDetails` |
| `GET /api/favorites` | `getFavorites` |
| `POST /api/favorites/:id/toggle` | `toggleFavorite` |

## Команды

```bash
npm run start:dev   # dev-сервер с перезапуском, порт 3000 (PORT)
npm run build       # nest build
npm run lint        # oxlint, в том числе архитектурные запреты импортов
npm test            # unit-тесты (Vitest)
npm run test:e2e    # e2e по эндпоинтам, TVmaze замокан
```

После изменений: `npm run lint && npm run build && npm test && npm run test:e2e`.

## Соглашения

- Контроллер — только HTTP, бизнес-логика — в тасках (обычные функции, имя — глагол, без Nest).
- Хранилища — обычные объекты: `cache` в `shared/cache`, `favorite` в `favorites/favorite-store.ts`.
- ESM: относительные импорты оканчиваются на `.js`. Алиасов нет.
- Стиль — prettier проекта (`.prettierrc`: одинарные кавычки, точки с запятой).
- Конфигурация — только через `shared/config/env.ts` (`PORT`, `TVMAZE_API_URL`).
- Любой файл — не больше 120 строк.
- Меняешь формат ответа — обнови DTO и маппер во frontend (`src/shared/api/backend/types.ts`).

## Подводные камни

- `npm install` на npm 10 падает с `Cannot read properties of null (reading 'edgesOut')`;
  поэтому в `.npmrc` включён `legacy-peer-deps=true`.
- `GET /api/shows/search` объявлен в контроллере раньше `:id` — порядок важен.
- TVmaze: индекс `/shows?page=N` с 0, по 250 штук, страницы — диапазоны id с пропусками;
  404 за концом → `[]`. Лимит ~20 запросов за 10 с (429) — кеш его бережёт.

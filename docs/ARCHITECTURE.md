# Архитектура backend

Те же принципы Simple Architecture, что и во frontend (`../simple-architecture/docs/ARCHITECTURE.md`),
перенесённые на сервер. Правила обязательны; если задачу нельзя решить по правилам —
сначала обсуждаем правило.

## 1. Слои

| Frontend (VIPER) | Backend | Где |
|---|---|---|
| View | JSON-ответ | — |
| Presenter | **Controller**: разбирает `params`/`query`, вызывает таску, отдаёт результат | `<module>/<module>.controller.ts` |
| Interactor | **Tasks** — бизнес-логика, обычные функции | `<module>/tasks/`, `src/tasks/` |
| Entity | **Store** — данные в памяти + методы их изменения | `favorites/favorite-store.ts` |
| Router | Маршруты Nest (декораторы контроллера) | контроллер |

**1.1. Controller — только HTTP.** Проверка и приведение параметров (`parsePage`, `ParseIntPipe`),
выбор таски, HTTP-статус. Ни фильтрации, ни походов в TVmaze.

**1.2. Таска — обычная функция, имя — глагол** (`getCatalogPage`, `toggleFavorite`). В тасках нет Nest,
Express, декораторов и DI: таска не знает, что её вызвали по HTTP. Со сторами таска работает
напрямую (`favoriteStore.add(...)`), как frontend-таски со сторами i18n и темы.

**1.3. Nest — транспорт, а не архитектура.** Модули и контроллеры нужны для маршрутизации.
Сервисы-провайдеры (`@Injectable`) для бизнес-логики не заводим — её место в тасках.

**1.4. Хранилища — обычные объекты** (`const cache = {}`, `const favorite = {}`), как требует
задание: без БД, всё в памяти процесса. Перезапуск сервера всё очищает.

## 2. Структура

```text
src/
├── main.ts                 запуск: префикс /api, фильтр ошибок
├── app/                    корневой модуль, ApiErrorFilter (ошибки TVmaze → HTTP)
├── shows/                  модуль «сериалы»: controller, parse-query, show-details, tasks/
├── favorites/              модуль «избранное»: controller, favorite-store, tasks/
├── model/show/             доменная модель нескольких модулей (Show, ShowsPage) + маппер DTO
├── tasks/                  глобальные таски нескольких модулей (filter-by-genre)
└── shared/                 инфраструктура без бизнес-смысла: config, http, cache, lib, tvmaze
```

- Модель одного модуля лежит в модуле (`shows/show-details.ts`).
- Таска одного модуля — в `<module>/tasks/`, нескольких — в `src/tasks/<name>/` (папка + `index.ts`).
- Модули `model`, `shared/*`, `tasks/*` импортируются только через `index.js`.
- Любой файл — не больше 120 строк.

## 3. Зависимости

`app → модули (controller → tasks → store) → tasks → model → shared`.

- `shared` не знает о `model`, `tasks`, модулях и `app`;
- `model` зависит только от `shared`;
- таски не импортируют `@nestjs/*`, `express`, контроллеры и модули.

Всё это проверяет `no-restricted-imports` в `.oxlintrc.json`. Меняешь правило — меняй и линтер.

## 4. Кеш и TVmaze

- DTO TVmaze (`shared/tvmaze/types.ts`) не выходят за пределы `shared/tvmaze` и мапперов.
- Кеш — инфраструктура, а не бизнес-логика: таски о нём не знают. `tvmazeApi` оборачивает каждый
  GET в `withCache` (ключ — полный URL, TTL — 5 минут). Хранится промис, поэтому одновременные
  одинаковые запросы делают один поход в TVmaze. Ошибки не кешируются; 404 за концом каталога → `[]`
  кешируется как обычный ответ.
- Нормализация, повышающая попадание в кеш (поиск в нижнем регистре), — в таске.

## 5. Ошибки

`ApiError` из `shared/http` (статус ответа TVmaze, `0` — нет ответа) переводит `ApiErrorFilter`:
404 → 404, 429 → 429, остальное → 502. Некорректные параметры — `BadRequestException` в контроллере.

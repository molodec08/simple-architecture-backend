/**
 * Доменная модель сериала. В отличие от DTO, она:
 *  - содержит только нужные приложению поля;
 *  - не содержит HTML (summary уже очищен);
 *  - не зависит от формы ответа TVmaze.
 */

export const knownShowStatuses = [
  'Running',
  'Ended',
  'To Be Determined',
  'In Development',
] as const;
export type KnownShowStatus = (typeof knownShowStatuses)[number];

export type Show = {
  id: number;
  name: string;
  genres: string[];
  /** Статус из API; известные значения переводит клиент, остальные показываются как есть */
  status: string;
  rating: number | null;
  premiered: string | null;
  posterUrl: string | null;
  summary: string;
};

/** Жанр в выдаче и количество сериалов этого жанра */
export type GenreOption = {
  name: string;
  count: number;
};

/** Страница выдачи: каталог или результаты поиска */
export type ShowsPage = {
  items: Show[];
  /** Текущая страница, начиная с 1 */
  page: number;
  /** Всего страниц; `null` — неизвестно (каталог TVmaze) */
  pageCount: number | null;
  hasNext: boolean;
  /** Сколько сериалов подходит под фильтр */
  total: number;
  /** Жанры всей выдачи до фильтрации — варианты для фильтра */
  genres: GenreOption[];
  /** Применённый жанр; `null`, если фильтра нет или такого жанра нет в выдаче */
  activeGenre: string | null;
};

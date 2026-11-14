import type { GenreOption, Show } from '../../model/show/index.js';

const collectGenres = (shows: Show[]): GenreOption[] => {
  const counts = new Map<string, number>();
  for (const genre of shows.flatMap((show) => show.genres)) {
    counts.set(genre, (counts.get(genre) ?? 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

/**
 * Таска «отфильтровать выдачу по жанру».
 * Возвращает жанры всей выдачи (варианты фильтра) и отфильтрованный список.
 * Жанр, которого нет в выдаче, игнорируется — показываем всё.
 */
export const filterByGenre = (shows: Show[], genre: string | undefined) => {
  const genres = collectGenres(shows);
  const activeGenre =
    genres.find((option) => option.name === genre)?.name ?? null;

  return {
    genres,
    activeGenre,
    items: activeGenre
      ? shows.filter((show) => show.genres.includes(activeGenre))
      : shows,
  };
};

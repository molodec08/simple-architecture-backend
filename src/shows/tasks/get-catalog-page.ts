import { mapShow, type ShowsPage } from '../../model/show/index.js';
import { tvmazeApi } from '../../shared/tvmaze/index.js';
import { filterByGenre } from '../../tasks/filter-by-genre/index.js';

/**
 * Таска «показать страницу каталога».
 * Страница каталога — страница индекса TVmaze (до 250 сериалов). У TVmaze нет
 * фильтра по жанру, поэтому жанр фильтруется внутри загруженной страницы.
 * @param page — номер страницы, начиная с 1
 */
export const getCatalogPage = async (
  page: number,
  genre: string | undefined,
): Promise<ShowsPage> => {
  const shows = (await tvmazeApi.getShows(page - 1)).map(mapShow);
  const { genres, activeGenre, items } = filterByGenre(shows, genre);

  return {
    items,
    page,
    pageCount: null,
    // Пустая страница TVmaze — конец каталога; иначе дальше может быть ещё
    hasNext: shows.length > 0,
    total: items.length,
    genres,
    activeGenre,
  };
};

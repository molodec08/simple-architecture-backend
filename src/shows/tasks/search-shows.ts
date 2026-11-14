import { mapShow, type ShowsPage } from '../../model/show/index.js';
import { paginate } from '../../shared/lib/index.js';
import { tvmazeApi } from '../../shared/tvmaze/index.js';
import { filterByGenre } from '../../tasks/filter-by-genre/index.js';

const PAGE_SIZE = 3;

/**
 * Таска «найти сериалы по названию».
 * TVmaze отдаёт все результаты сразу; жанр и страницы применяем сами.
 * @param page — номер страницы, начиная с 1
 */
export const searchShows = async (
  query: string,
  page: number,
  genre: string | undefined,
): Promise<ShowsPage> => {
  // Регистр для поиска TVmaze не важен, а одинаковый ключ лучше попадает в кеш
  const results = await tvmazeApi.searchShows(query.trim().toLowerCase());
  const { genres, activeGenre, items } = filterByGenre(
    results.map((result) => mapShow(result.show)),
    genre,
  );
  const { pageItems, currentPage, pageCount } = paginate(
    items,
    page,
    PAGE_SIZE,
  );

  return {
    items: pageItems,
    page: currentPage,
    pageCount,
    hasNext: currentPage < pageCount,
    total: items.length,
    genres,
    activeGenre,
  };
};

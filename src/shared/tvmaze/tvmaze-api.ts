import { withCache } from '../cache/index.js';
import { env } from '../config/index.js';
import {
  createHttpClient,
  isApiError,
  type QueryParams,
} from '../http/index.js';
import type {
  TvmazeSearchResultDto,
  TvmazeShowDto,
  TvmazeShowWithCastDto,
} from './types.js';

/** Одинаковый запрос к TVmaze в течение 5 минут отдаётся из кеша. */
const CACHE_TTL_MS = 5 * 60 * 1000;

const http = createHttpClient(env.tvmazeApiUrl);

/**
 * GET через кеш. Ключ кеша — полный URL запроса.
 * `onNotFound` превращает 404 в обычное значение; оно кешируется так же, как ответ.
 */
const cachedGet = <T>(
  path: string,
  params?: QueryParams,
  onNotFound?: () => T,
) =>
  withCache(http.buildUrl(path, params), CACHE_TTL_MS, async () => {
    try {
      return await http.get<T>(path, params);
    } catch (error) {
      if (onNotFound && isApiError(error) && error.status === 404)
        return onNotFound();
      throw error;
    }
  });

/**
 * Эндпоинты TVmaze. Только транспорт и кеш: никакой бизнес-логики и маппинга.
 */
export const tvmazeApi = {
  /**
   * Индекс сериалов. Страницы нумеруются с 0, до 250 записей на страницу.
   * За последней страницей API отвечает 404 — превращаем это в пустой массив.
   */
  getShows: (page: number) =>
    cachedGet<TvmazeShowDto[]>('/shows', { page }, () => []),

  searchShows: (query: string) =>
    cachedGet<TvmazeSearchResultDto[]>('/search/shows', { q: query }),

  getShow: (id: number) => cachedGet<TvmazeShowDto>(`/shows/${id}`),

  getShowWithCast: (id: number) =>
    cachedGet<TvmazeShowWithCastDto>(`/shows/${id}`, { embed: 'cast' }),
};

import { mapShow, type Show } from '../../model/show/index.js';
import { tvmazeApi } from '../../shared/tvmaze/index.js';
import { favoriteStore } from '../favorite-store.js';

export type ToggleFavoriteResult = {
  /** Состояние после переключения */
  isFavorite: boolean;
  show: Show;
};

/**
 * Таска «добавить в избранное или убрать оттуда».
 * Решение принимает сервер: клиент только сообщает, на какой сериал нажали.
 */
export const toggleFavorite = async (
  showId: number,
): Promise<ToggleFavoriteResult> => {
  const existing = favoriteStore.get(showId);
  if (existing) {
    favoriteStore.remove(showId);
    return { isFavorite: false, show: existing };
  }

  const show = mapShow(await tvmazeApi.getShow(showId));
  favoriteStore.add(show);
  return { isFavorite: true, show };
};

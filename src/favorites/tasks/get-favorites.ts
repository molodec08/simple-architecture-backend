import type { Show } from '../../model/show/index.js';
import { favoriteStore } from '../favorite-store.js';

/** Таска «показать избранное»: недавно добавленные — первыми. */
export const getFavorites = (): Show[] =>
  favoriteStore
    .list()
    .sort((a, b) => b.addedAt - a.addedAt)
    .map((entry) => entry.show);

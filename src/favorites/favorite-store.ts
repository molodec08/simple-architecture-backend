import type { Show } from '../model/show/index.js';

type FavoriteEntry = {
  /** Снимок сериала на момент добавления: списку не нужны запросы к TVmaze */
  show: Show;
  addedAt: number;
};

/** Избранное в памяти процесса. Ключ — id сериала. */
const favorite: Record<number, FavoriteEntry> = {};

/** Стор избранного (Entity): данные и методы их изменения. */
export const favoriteStore = {
  get: (id: number): Show | undefined => favorite[id]?.show,
  add: (show: Show) => {
    favorite[show.id] = { show, addedAt: Date.now() };
  },
  remove: (id: number) => {
    delete favorite[id];
  },
  list: (): FavoriteEntry[] => Object.values(favorite),
  /** Очистка (нужна тестам) */
  clear: () => {
    for (const id of Object.keys(favorite)) delete favorite[Number(id)];
  },
};

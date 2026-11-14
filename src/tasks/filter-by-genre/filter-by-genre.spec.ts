import type { Show } from '../../model/show/index.js';
import { filterByGenre } from './filter-by-genre.js';

const show = (id: number, genres: string[]): Show => ({
  id,
  name: `Show ${id}`,
  genres,
  status: 'Ended',
  rating: null,
  premiered: null,
  posterUrl: null,
  summary: '',
});

const shows = [
  show(1, ['Drama']),
  show(2, ['Drama', 'Comedy']),
  show(3, ['Action']),
];

describe('filterByGenre', () => {
  it('собирает жанры всей выдачи: частые первыми, затем по алфавиту', () => {
    expect(filterByGenre(shows, undefined).genres).toEqual([
      { name: 'Drama', count: 2 },
      { name: 'Action', count: 1 },
      { name: 'Comedy', count: 1 },
    ]);
  });

  it('фильтрует по выбранному жанру', () => {
    const result = filterByGenre(shows, 'Drama');

    expect(result.activeGenre).toBe('Drama');
    expect(result.items.map((item) => item.id)).toEqual([1, 2]);
  });

  it('неизвестный жанр игнорируется', () => {
    const result = filterByGenre(shows, 'Horror');

    expect(result.activeGenre).toBeNull();
    expect(result.items).toHaveLength(3);
  });
});

import type { TvmazeShowDto } from '../../shared/tvmaze/index.js';
import { tvmazeApi } from '../../shared/tvmaze/index.js';
import { favoriteStore } from '../favorite-store.js';
import { getFavorites } from './get-favorites.js';
import { toggleFavorite } from './toggle-favorite.js';

vi.mock('../../shared/tvmaze/index.js', () => ({
  tvmazeApi: { getShow: vi.fn() },
}));

const dto = (id: number) =>
  ({
    id,
    name: `Show ${id}`,
    genres: [],
    status: 'Ended',
    rating: { average: null },
    premiered: null,
    image: null,
    summary: '<p>Text</p>',
  }) as unknown as TvmazeShowDto;

describe('toggleFavorite', () => {
  beforeEach(() => {
    favoriteStore.clear();
    vi.mocked(tvmazeApi.getShow).mockImplementation((id) =>
      Promise.resolve(dto(id)),
    );
  });

  it('добавляет сериал, которого нет в избранном', async () => {
    const result = await toggleFavorite(1);

    expect(result.isFavorite).toBe(true);
    expect(result.show).toMatchObject({ id: 1, summary: 'Text' });
    expect(getFavorites().map((show) => show.id)).toEqual([1]);
  });

  it('повторное нажатие убирает сериал без запроса к TVmaze', async () => {
    await toggleFavorite(1);
    vi.mocked(tvmazeApi.getShow).mockClear();

    const result = await toggleFavorite(1);

    expect(result).toMatchObject({ isFavorite: false, show: { id: 1 } });
    expect(getFavorites()).toEqual([]);
    expect(tvmazeApi.getShow).not.toHaveBeenCalled();
  });

  it('список избранного: недавно добавленные первыми', async () => {
    vi.useFakeTimers();
    await toggleFavorite(1);
    vi.advanceTimersByTime(1000);
    await toggleFavorite(2);
    vi.useRealTimers();

    expect(getFavorites().map((show) => show.id)).toEqual([2, 1]);
  });
});

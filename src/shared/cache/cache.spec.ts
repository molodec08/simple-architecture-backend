import { clearCache, withCache } from './cache.js';

const TTL = 5 * 60 * 1000;

describe('withCache', () => {
  beforeEach(() => {
    clearCache();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('повторный запрос в пределах TTL берётся из кеша', async () => {
    const load = vi.fn().mockResolvedValue('data');

    await withCache('key', TTL, load);
    vi.advanceTimersByTime(TTL - 1);
    const result = await withCache('key', TTL, load);

    expect(result).toBe('data');
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('после TTL запрос снова идёт в источник и обновляет кеш', async () => {
    const load = vi
      .fn()
      .mockResolvedValueOnce('old')
      .mockResolvedValueOnce('new');

    await withCache('key', TTL, load);
    vi.advanceTimersByTime(TTL);

    expect(await withCache('key', TTL, load)).toBe('new');
    expect(await withCache('key', TTL, load)).toBe('new');
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('разные ключи кешируются отдельно', async () => {
    const load = vi.fn().mockResolvedValue('data');

    await withCache('a', TTL, load);
    await withCache('b', TTL, load);

    expect(load).toHaveBeenCalledTimes(2);
  });

  it('одновременные одинаковые запросы делают один вызов', async () => {
    const load = vi.fn().mockResolvedValue('data');

    await Promise.all([
      withCache('key', TTL, load),
      withCache('key', TTL, load),
    ]);

    expect(load).toHaveBeenCalledTimes(1);
  });

  it('ошибка не кешируется', async () => {
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('data');

    await expect(withCache('key', TTL, load)).rejects.toThrow('fail');
    expect(await withCache('key', TTL, load)).toBe('data');
  });
});

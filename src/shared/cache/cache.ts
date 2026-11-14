type CacheEntry = {
  /** Промис ответа: одинаковые одновременные запросы ждут один и тот же вызов */
  value: Promise<unknown>;
  expiresAt: number;
};

/** Кеш в памяти процесса: ключ — запрос, значение — его ответ. */
const cache: Record<string, CacheEntry> = {};

/**
 * Возвращает свежее значение из кеша или вызывает `load` и запоминает результат
 * на `ttlMs` миллисекунд. Ошибки не кешируются: следующий вызов повторит `load`.
 */
export const withCache = <T>(
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> => {
  const now = Date.now();
  const entry = cache[key];
  if (entry && entry.expiresAt > now) return entry.value as Promise<T>;

  const value = load();
  cache[key] = { value, expiresAt: now + ttlMs };
  value.catch(() => {
    if (cache[key]?.value === value) delete cache[key];
  });
  return value;
};

/** Полная очистка кеша (нужна тестам). */
export const clearCache = () => {
  for (const key of Object.keys(cache)) delete cache[key];
};

/**
 * Минимальная обёртка над fetch для запросов к внешним API.
 * Ничего не знает о конкретном API: только базовый URL, query-параметры и ошибки.
 */

/** Ошибка внешнего API. `status === 0` — ответа не было (сеть, таймаут). */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

export type QueryParams = Record<string, string | number | undefined>;

const TIMEOUT_MS = 10_000;

export const createHttpClient = (baseUrl: string) => {
  const buildUrl = (path: string, params: QueryParams = {}) => {
    const url = new URL(path, baseUrl);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    return url.toString();
  };

  const get = async <T>(path: string, params?: QueryParams): Promise<T> => {
    let response: Response;
    try {
      response = await fetch(buildUrl(path, params), {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      throw new ApiError(0, `GET ${path} failed: ${String(error)}`);
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `GET ${path} failed with status ${response.status}`,
      );
    }

    return (await response.json()) as T;
  };

  return { buildUrl, get };
};

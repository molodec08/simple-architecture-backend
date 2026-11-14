/**
 * Конфигурация окружения.
 * Все обращения к process.env собраны здесь, остальной код от них не зависит.
 */
export const env = {
  port: Number(process.env.PORT ?? 3000),
  tvmazeApiUrl: process.env.TVMAZE_API_URL ?? 'https://api.tvmaze.com',
} as const;

/**
 * DTO — типы ровно в том виде, в каком их отдаёт TVmaze API.
 * Документация: https://www.tvmaze.com/api
 *
 * Описаны только поля, которые используются в приложении.
 */

export type TvmazeImageDto = {
  medium: string;
  original: string;
};

export type TvmazeNetworkDto = {
  id: number;
  name: string;
  country: { name: string; code: string } | null;
};

export type TvmazeShowDto = {
  id: number;
  name: string;
  type: string;
  language: string | null;
  genres: string[];
  status: string;
  runtime: number | null;
  averageRuntime: number | null;
  premiered: string | null;
  ended: string | null;
  officialSite: string | null;
  rating: { average: number | null };
  network: TvmazeNetworkDto | null;
  webChannel: TvmazeNetworkDto | null;
  image: TvmazeImageDto | null;
  /** HTML-строка */
  summary: string | null;
};

export type TvmazeCastDto = {
  person: { id: number; name: string; image: TvmazeImageDto | null };
  character: { id: number; name: string; image: TvmazeImageDto | null };
};

export type TvmazeShowWithCastDto = TvmazeShowDto & {
  _embedded?: { cast?: TvmazeCastDto[] };
};

export type TvmazeSearchResultDto = {
  score: number;
  show: TvmazeShowDto;
};

import { htmlToText } from '../../shared/lib/index.js';
import type { TvmazeShowDto } from '../../shared/tvmaze/index.js';
import type { Show } from './show.js';

export const mapShow = (dto: TvmazeShowDto): Show => ({
  id: dto.id,
  name: dto.name,
  genres: dto.genres,
  status: dto.status,
  rating: dto.rating.average,
  premiered: dto.premiered,
  posterUrl: dto.image?.medium ?? null,
  summary: htmlToText(dto.summary),
});

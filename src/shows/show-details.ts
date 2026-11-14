import { mapShow, type Show } from '../model/show/index.js';
import type { TvmazeShowWithCastDto } from '../shared/tvmaze/index.js';

export type CastMember = {
  personId: number;
  personName: string;
  characterName: string;
  photoUrl: string | null;
};

/** Подробности о сериале — модель, нужная только модулю shows. */
export type ShowDetails = Show & {
  ended: string | null;
  language: string | null;
  network: string | null;
  runtime: number | null;
  officialSite: string | null;
  posterUrlLarge: string | null;
  cast: CastMember[];
};

export const mapShowDetails = (dto: TvmazeShowWithCastDto): ShowDetails => ({
  ...mapShow(dto),
  ended: dto.ended,
  language: dto.language,
  network: dto.network?.name ?? dto.webChannel?.name ?? null,
  runtime: dto.runtime ?? dto.averageRuntime,
  officialSite: dto.officialSite,
  posterUrlLarge: dto.image?.original ?? null,
  cast: (dto._embedded?.cast ?? []).map(({ person, character }) => ({
    personId: person.id,
    personName: person.name,
    characterName: character.name,
    photoUrl: character.image?.medium ?? person.image?.medium ?? null,
  })),
});

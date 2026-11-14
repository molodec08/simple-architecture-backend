import { BadRequestException } from '@nestjs/common';

/** Номер страницы из query: пусто — первая страница, мусор — 400. */
export const parsePage = (raw: string | undefined): number => {
  if (raw === undefined || raw === '') return 1;
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 1) {
    throw new BadRequestException(
      'Query parameter "page" must be a positive integer',
    );
  }
  return page;
};

/** Необязательная строка из query: пробелы обрезаются, пустая — `undefined`. */
export const parseOptional = (raw: string | undefined) =>
  raw?.trim() || undefined;

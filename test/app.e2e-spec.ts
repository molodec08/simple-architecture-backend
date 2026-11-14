import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { ApiErrorFilter } from '../src/app/api-error.filter.js';
import { AppModule } from '../src/app/app.module.js';
import { ApiError } from '../src/shared/http/index.js';
import { tvmazeApi } from '../src/shared/tvmaze/index.js';

vi.mock('../src/shared/tvmaze/index.js', () => ({
  tvmazeApi: {
    getShows: vi.fn(),
    searchShows: vi.fn(),
    getShow: vi.fn(),
    getShowWithCast: vi.fn(),
  },
}));

const dto = (id: number, genres: string[]) => ({
  id,
  name: `Show ${id}`,
  genres,
  status: 'Ended',
  rating: { average: 8 },
  premiered: '2020-01-01',
  image: null,
  summary: '<p>About</p>',
});

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new ApiErrorFilter());
    await app.init();
  });

  afterEach(() => app.close());

  it('GET /api/shows фильтрует страницу каталога по жанру', async () => {
    vi.mocked(tvmazeApi.getShows).mockResolvedValue([
      dto(1, ['Drama']),
      dto(2, ['Comedy']),
    ] as never);

    const { body } = await request(app.getHttpServer())
      .get('/api/shows?page=2&genre=Drama')
      .expect(200);

    expect(tvmazeApi.getShows).toHaveBeenCalledWith(1);
    expect(body).toMatchObject({
      page: 2,
      pageCount: null,
      hasNext: true,
      total: 1,
      activeGenre: 'Drama',
      items: [{ id: 1, summary: 'About' }],
    });
  });

  it('GET /api/shows/search режет выдачу на страницы', async () => {
    vi.mocked(tvmazeApi.searchShows).mockResolvedValue(
      [1, 2, 3, 4].map((id) => ({ score: 1, show: dto(id, []) })) as never,
    );

    const { body } = await request(app.getHttpServer())
      .get('/api/shows/search?q=Show&page=2')
      .expect(200);

    expect(body).toMatchObject({
      page: 2,
      pageCount: 2,
      hasNext: false,
      total: 4,
    });
    expect(body.items).toHaveLength(1);
  });

  it('без q поиск отвечает 400, кривая страница — 400', async () => {
    await request(app.getHttpServer()).get('/api/shows/search').expect(400);
    await request(app.getHttpServer()).get('/api/shows?page=abc').expect(400);
  });

  it('404 от TVmaze превращается в 404', async () => {
    vi.mocked(tvmazeApi.getShowWithCast).mockRejectedValue(
      new ApiError(404, 'not found'),
    );

    await request(app.getHttpServer()).get('/api/shows/999').expect(404);
  });

  it('toggle добавляет и убирает сериал из избранного', async () => {
    vi.mocked(tvmazeApi.getShow).mockResolvedValue(dto(7, []) as never);
    const server = app.getHttpServer();

    const added = await request(server)
      .post('/api/favorites/7/toggle')
      .expect(200);
    expect(added.body).toMatchObject({ isFavorite: true, show: { id: 7 } });
    expect((await request(server).get('/api/favorites')).body).toHaveLength(1);

    const removed = await request(server)
      .post('/api/favorites/7/toggle')
      .expect(200);
    expect(removed.body.isFavorite).toBe(false);
    expect((await request(server).get('/api/favorites')).body).toEqual([]);
  });
});

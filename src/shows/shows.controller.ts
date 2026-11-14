import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { parseOptional, parsePage } from './parse-query.js';
import { getCatalogPage } from './tasks/get-catalog-page.js';
import { getShowDetails } from './tasks/get-show-details.js';
import { searchShows } from './tasks/search-shows.js';

/**
 * HTTP-слой сериалов (аналог Presenter): разбирает запрос, вызывает таску,
 * отдаёт результат. Бизнес-логики здесь нет — она в тасках.
 */
@Controller('shows')
export class ShowsController {
  @Get()
  getCatalog(@Query('page') page?: string, @Query('genre') genre?: string) {
    return getCatalogPage(parsePage(page), parseOptional(genre));
  }

  // Объявлен раньше `:id`, иначе `search` попадёт в параметр id
  @Get('search')
  search(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('genre') genre?: string,
  ) {
    const query = parseOptional(q);
    if (!query) {
      throw new BadRequestException('Query parameter "q" is required');
    }
    return searchShows(query, parsePage(page), parseOptional(genre));
  }

  @Get(':id')
  getDetails(@Param('id', ParseIntPipe) id: number) {
    return getShowDetails(id);
  }
}

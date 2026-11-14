import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { getFavorites } from './tasks/get-favorites.js';
import { toggleFavorite } from './tasks/toggle-favorite.js';

/** HTTP-слой избранного: разбирает запрос и вызывает таску. */
@Controller('favorites')
export class FavoritesController {
  @Get()
  list() {
    return getFavorites();
  }

  @Post(':id/toggle')
  @HttpCode(HttpStatus.OK)
  toggle(@Param('id', ParseIntPipe) id: number) {
    return toggleFavorite(id);
  }
}

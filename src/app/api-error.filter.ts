import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiError } from '../shared/http/index.js';

/** 404 и 429 от TVmaze понятны клиенту как есть; остальное — сбой источника данных. */
const toHttpStatus = (upstreamStatus: number) => {
  if (upstreamStatus === 404) return HttpStatus.NOT_FOUND;
  if (upstreamStatus === 429) return HttpStatus.TOO_MANY_REQUESTS;
  return HttpStatus.BAD_GATEWAY;
};

/** Переводит ошибки внешнего API в HTTP-ответы нашего API. */
@Catch(ApiError)
export class ApiErrorFilter implements ExceptionFilter {
  catch(error: ApiError, host: ArgumentsHost) {
    const statusCode = toHttpStatus(error.status);
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(statusCode)
      .json({ statusCode, message: error.message });
  }
}

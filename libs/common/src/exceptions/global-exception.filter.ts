import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppException } from '../exceptions/base.exception';

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  data: null;
  error: {
    code: string;
    message: string;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof AppException) {
      statusCode = exception.statusCode;
      message = exception.message;
      code = exception.code;

      // 모듈별 로깅
      this.logger.error(
        `[${exception.code}] ${exception.message}`,
        exception.stack,
      );
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;

      this.logger.error(
        `[HTTP Exception] ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error(
        `Unhandled exception: ${exception}`,
        (exception as Error).stack,
      );
    }

    const responseBody: ErrorResponse = {
      success: false,
      statusCode,
      data: null,
      error: {
        code,
        message,
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}

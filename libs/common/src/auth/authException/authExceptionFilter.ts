import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthException } from './authException';

@Catch(AuthException, HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: AuthException | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let statusCode: number;
    let message: string;

    if (exception instanceof AuthException && exception.errorCode) {
      statusCode = exception.errorCode.statusCode;
      message = exception.errorCode.message;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    if (exception.message) {
      message = exception.message;
    }

    res.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      message,
      path: req.url,
    });
  }
}

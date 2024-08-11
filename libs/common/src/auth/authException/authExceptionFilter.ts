import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { createErrorResponse } from '@app/common/utils/api-response.util';
import { AuthException } from '@app/common/auth/authException/authExceptions';

@Catch(AuthException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: AuthException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status = exception.errorCode.statusCode;
    const code = exception.name; // 예외의 이름을 코드로 사용
    const message = exception.message;

    res.status(status).json(
      createErrorResponse(code, message, status), // statusCode 포함
    );
  }
}

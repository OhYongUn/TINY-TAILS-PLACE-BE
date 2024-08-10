import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { RoomException } from '@apps/rest/room/exceptions/room-exceptions';
import { createErrorResponse } from '@app/common/utils/api-response.util';

@Catch(RoomException)
export class RoomExceptionFilter implements ExceptionFilter {
  catch(exception: RoomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatusCode();
    const code = exception.name; // 예외의 이름을 코드로 사용
    const message = exception.getErrorMessage();

    res.status(status).json(createErrorResponse(code, message, status));
  }
}

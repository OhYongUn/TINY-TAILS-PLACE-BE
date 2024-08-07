import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  RoomException,
  CapacityExceededException,
  InvalidDateRangeException,
  RoomNotAvailableException,
  RoomNotFoundException,
} from '@apps/rest/room/exceptions/room-exceptions';

@Catch(RoomException)
export class RoomExceptionFilter implements ExceptionFilter {
  catch(exception: RoomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status = exception.errorCode.statusCode;
    const message = exception.message;
    let error = 'Room Error';

    switch (exception.constructor) {
      case RoomNotFoundException:
        error = '객실 찾기 오류';
        break;
      case RoomNotAvailableException:
        error = '객실 이용 불가';
        break;
      case InvalidDateRangeException:
        error = '잘못된 날짜 범위';
        break;
      case CapacityExceededException:
        error = '수용 인원 초과';
        break;
    }

    res.status(status).json({
      statusCode: status,
      message: message,
      error: error,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}

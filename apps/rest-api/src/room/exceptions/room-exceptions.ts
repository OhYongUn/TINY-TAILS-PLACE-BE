// src/exceptions/room-exceptions.ts
import { ErrorCode } from './error-codes';

export class RoomException extends Error {
  constructor(
    public errorCode: ErrorCode,
    message?: string,
  ) {
    super(message || errorCode.message);
    this.name = this.constructor.name;
  }
}

export class RoomNotFoundException extends RoomException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, message || '객실을 찾을 수 없습니다');
  }
}

export class RoomNotAvailableException extends RoomException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, message || '해당 날짜에 이용 가능한 객실이 없습니다');
  }
}

export class InvalidDateRangeException extends RoomException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, message || '잘못된 날짜 범위입니다');
  }
}

export class CapacityExceededException extends RoomException {
  constructor(errorCode: ErrorCode, message?: string) {
    super(errorCode, message || '객실 수용 인원을 초과했습니다');
  }
}

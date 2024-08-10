import { ErrorCode, RoomErrorCodes } from './error-codes';

export class RoomException extends Error {
  constructor(
    public errorCode: ErrorCode,
    message?: string,
  ) {
    super(message || errorCode.message);
    this.name = this.constructor.name;
  }

  getStatusCode(): number {
    return this.errorCode.statusCode;
  }

  getErrorMessage(): string {
    return this.message || this.errorCode.message;
  }
}

export class RoomNotFoundException extends RoomException {
  constructor() {
    super(RoomErrorCodes.ROOM_NOT_FOUND);
  }
}

export class RoomNotAvailableException extends RoomException {
  constructor() {
    super(RoomErrorCodes.ROOM_NOT_AVAILABLE);
  }
}

export class InvalidDateRangeException extends RoomException {
  constructor() {
    super(RoomErrorCodes.INVALID_DATE_RANGE);
  }
}

export class CapacityExceededException extends RoomException {
  constructor() {
    super(RoomErrorCodes.CAPACITY_EXCEEDED);
  }
}

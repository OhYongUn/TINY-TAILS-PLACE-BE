import {
  ErrorCode,
  UserErrorCodes,
} from '@apps/rest/users/exceptions/error-codes';

export class UserException extends Error {
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

export class UserNotFoundException extends UserException {
  constructor() {
    super(UserErrorCodes.USER_NOT_FOUND);
  }
}

export class EmailAlreadyExistsException extends UserException {
  constructor() {
    super(UserErrorCodes.EMAIL_ALREADY_EXISTS);
  }
}

export class InvalidPasswordException extends UserException {
  constructor() {
    super(UserErrorCodes.INVALID_PASSWORD);
  }
}

export class ProfileUpdateFailedException extends UserException {
  constructor() {
    super(UserErrorCodes.PROFILE_UPDATE_FAILED);
  }
}

export class NotStrongPassWord extends UserException {
  constructor() {
    super(UserErrorCodes.WEAK_PASSWORD);
  }
}

// 필요에 따라 추가적인 User 관련 예외들을 정의할 수 있습니다.
export class UserNotAuthorizedException extends UserException {
  constructor() {
    super(new ErrorCode('USER_NOT_AUTHORIZED', 403, '권한이 없습니다'));
  }
}

export class InvalidUserDataException extends UserException {
  constructor(message: string) {
    super(new ErrorCode('INVALID_USER_DATA', 400, message));
  }
}

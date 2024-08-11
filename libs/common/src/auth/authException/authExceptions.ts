import {
  AuthErrorCodes,
  ErrorCode,
} from '@app/common/auth/authException/error-code';

export class AuthException extends Error {
  constructor(
    public errorCode: ErrorCode,
    message?: string,
  ) {
    super(message || errorCode.message);
    this.name = this.constructor.name;
  }
}

export class UserNotFoundException extends AuthException {
  constructor() {
    super(AuthErrorCodes.USER_NOT_FOUND);
  }
}

export class UserAlreadyExistException extends AuthException {
  constructor() {
    super(AuthErrorCodes.USER_ALREADY_EXIST);
  }
}

export class PasswordWrongException extends AuthException {
  constructor() {
    super(AuthErrorCodes.PASSWORD_WRONG);
  }
}

export class OverRetryException extends AuthException {
  constructor() {
    super(AuthErrorCodes.OVER_RETRY);
  }
}

export class InvalidTokenException extends AuthException {
  constructor() {
    super(AuthErrorCodes.INVALID_TOKEN);
  }
}

export class TokenExpiredException extends AuthException {
  constructor() {
    super(AuthErrorCodes.TOKEN_EXPIRED);
  }
}

export class UnauthorizedException extends AuthException {
  constructor() {
    super(AuthErrorCodes.UNAUTHORIZED);
  }
}

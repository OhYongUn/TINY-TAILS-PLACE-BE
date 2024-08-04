import { AuthExceptionCode } from './error.constants';
import { ErrorCode } from './errorCode';
import { AuthException } from './authException';

class CustomAuthException extends AuthException {
  constructor(statusCode: number, defaultMessage: string, message?: string) {
    const errorCode = new ErrorCode(statusCode, defaultMessage);
    super(errorCode, message);
  }
}

export class UserNotFoundException extends CustomAuthException {
  constructor(message?: string) {
    super(AuthExceptionCode.UserNotFound, 'user is not exist', message);
  }
}

export class UserAlreadyExistException extends CustomAuthException {
  constructor(message?: string) {
    super(AuthExceptionCode.UserAlreadyExist, 'user is already exist', message);
  }
}

export class PasswordWrongException extends CustomAuthException {
  constructor(message?: string) {
    super(AuthExceptionCode.PasswordWrong, 'password is wrong', message);
  }
}

export class OverRetryException extends CustomAuthException {
  constructor(message?: string) {
    super(AuthExceptionCode.OverRetry, 'too many retry', message);
  }
}

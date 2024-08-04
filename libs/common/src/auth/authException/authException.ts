import { ErrorCode } from './errorCode';

export class AuthException extends Error {
  constructor(
    public errorCode: ErrorCode,
    message?: string,
  ) {
    super(message || errorCode.message);
  }
}

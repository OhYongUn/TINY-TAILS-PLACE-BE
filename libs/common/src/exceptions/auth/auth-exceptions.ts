import {AppException} from "@app/common/exceptions/base.exception";
import {AuthErrorCodes} from "@app/common/exceptions/auth/error-code";

export const AuthExceptions = {
  userNotFound: () => new AppException(
      AuthErrorCodes.USER_NOT_FOUND.code,
      AuthErrorCodes.USER_NOT_FOUND.statusCode,
      AuthErrorCodes.USER_NOT_FOUND.message
  ),
  userAlreadyExist: () => new AppException(
      AuthErrorCodes.USER_ALREADY_EXIST.code,
      AuthErrorCodes.USER_ALREADY_EXIST.statusCode,
      AuthErrorCodes.USER_ALREADY_EXIST.message
  ),
  passwordWrong: () => new AppException(
      AuthErrorCodes.PASSWORD_WRONG.code,
      AuthErrorCodes.PASSWORD_WRONG.statusCode,
      AuthErrorCodes.PASSWORD_WRONG.message
  ),
  overRetry: () => new AppException(
      AuthErrorCodes.OVER_RETRY.code,
      AuthErrorCodes.OVER_RETRY.statusCode,
      AuthErrorCodes.OVER_RETRY.message
  ),
  invalidToken: () => new AppException(
      AuthErrorCodes.INVALID_TOKEN.code,
      AuthErrorCodes.INVALID_TOKEN.statusCode,
      AuthErrorCodes.INVALID_TOKEN.message
  ),
  tokenExpired: () => new AppException(
      AuthErrorCodes.TOKEN_EXPIRED.code,
      AuthErrorCodes.TOKEN_EXPIRED.statusCode,
      AuthErrorCodes.TOKEN_EXPIRED.message
  ),
  unauthorized: () => new AppException(
      AuthErrorCodes.UNAUTHORIZED.code,
      AuthErrorCodes.UNAUTHORIZED.statusCode,
      AuthErrorCodes.UNAUTHORIZED.message
  ),
  // 추가된 새로운 예외들
  invalidEmailFormat: () => new AppException(
      AuthErrorCodes.INVALID_EMAIL_FORMAT.code,
      AuthErrorCodes.INVALID_EMAIL_FORMAT.statusCode,
      AuthErrorCodes.INVALID_EMAIL_FORMAT.message
  ),
  weakPassword: () => new AppException(
      AuthErrorCodes.WEAK_PASSWORD.code,
      AuthErrorCodes.WEAK_PASSWORD.statusCode,
      AuthErrorCodes.WEAK_PASSWORD.message
  ),
  missingRequiredFields: () => new AppException(
      AuthErrorCodes.MISSING_REQUIRED_FIELDS.code,
      AuthErrorCodes.MISSING_REQUIRED_FIELDS.statusCode,
      AuthErrorCodes.MISSING_REQUIRED_FIELDS.message
  ),
  emailAlreadyInUse: () => new AppException(
      AuthErrorCodes.EMAIL_ALREADY_IN_USE.code,
      AuthErrorCodes.EMAIL_ALREADY_IN_USE.statusCode,
      AuthErrorCodes.EMAIL_ALREADY_IN_USE.message
  ),
  registrationFailed: () => new AppException(
      AuthErrorCodes.REGISTRATION_FAILED.code,
      AuthErrorCodes.REGISTRATION_FAILED.statusCode,
      AuthErrorCodes.REGISTRATION_FAILED.message
  ),
  invalidNameFormat: () => new AppException(
      AuthErrorCodes.INVALID_NAME_FORMAT.code,
      AuthErrorCodes.INVALID_NAME_FORMAT.statusCode,
      AuthErrorCodes.INVALID_NAME_FORMAT.message
  ),
  termsNotAgreed: () => new AppException(
      AuthErrorCodes.TERMS_NOT_AGREED.code,
      AuthErrorCodes.TERMS_NOT_AGREED.statusCode,
      AuthErrorCodes.TERMS_NOT_AGREED.message
  )
}
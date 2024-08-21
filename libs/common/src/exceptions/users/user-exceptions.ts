import {AppException} from "@app/common/exceptions/base.exception";
import {UserErrorCodes} from "@app/common/exceptions/users/error-codes";

export const UserExceptions = {
  userNotFound: () => new AppException(
      UserErrorCodes.USER_NOT_FOUND.code,
      UserErrorCodes.USER_NOT_FOUND.statusCode,
      UserErrorCodes.USER_NOT_FOUND.message
  ),
  emailAlreadyExists: () => new AppException(
      UserErrorCodes.EMAIL_ALREADY_EXISTS.code,
      UserErrorCodes.EMAIL_ALREADY_EXISTS.statusCode,
      UserErrorCodes.EMAIL_ALREADY_EXISTS.message
  ),
  invalidPassword: () => new AppException(
      UserErrorCodes.INVALID_PASSWORD.code,
      UserErrorCodes.INVALID_PASSWORD.statusCode,
      UserErrorCodes.INVALID_PASSWORD.message
  ),
  profileUpdateFailed: () => new AppException(
      UserErrorCodes.PROFILE_UPDATE_FAILED.code,
      UserErrorCodes.PROFILE_UPDATE_FAILED.statusCode,
      UserErrorCodes.PROFILE_UPDATE_FAILED.message
  ),
  weakPassword: () => new AppException(
      UserErrorCodes.WEAK_PASSWORD.code,
      UserErrorCodes.WEAK_PASSWORD.statusCode,
      UserErrorCodes.WEAK_PASSWORD.message
  ),
  userNotAuthorized: () => new AppException(
      UserErrorCodes.USER_NOT_AUTHORIZED.code,
      UserErrorCodes.USER_NOT_AUTHORIZED.statusCode,
      UserErrorCodes.USER_NOT_AUTHORIZED.message
  ),
  invalidUserData: (message: string = UserErrorCodes.INVALID_USER_DATA.message) => new AppException(
      UserErrorCodes.INVALID_USER_DATA.code,
      UserErrorCodes.INVALID_USER_DATA.statusCode,
      message
  ),
};
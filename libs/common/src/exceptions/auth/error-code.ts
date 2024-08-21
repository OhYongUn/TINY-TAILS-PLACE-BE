import {ErrorCode} from "@app/common/exceptions/error-code";

export const AuthErrorCodes = {
  USER_NOT_FOUND: new ErrorCode('USER_NOT_FOUND', 404, '사용자를 찾을 수 없습니다'),
  USER_ALREADY_EXIST: new ErrorCode('USER_ALREADY_EXIST', 409, '이미 존재하는 사용자입니다'),
  PASSWORD_WRONG: new ErrorCode('PASSWORD_WRONG', 401, '비밀번호가 올바르지 않습니다'),
  OVER_RETRY: new ErrorCode('OVER_RETRY', 429, '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요'),
  INVALID_TOKEN: new ErrorCode('INVALID_TOKEN', 401, '유효하지 않은 토큰입니다'),
  TOKEN_EXPIRED: new ErrorCode('TOKEN_EXPIRED', 401, '토큰이 만료되었습니다'),
  UNAUTHORIZED: new ErrorCode('UNAUTHORIZED', 401, '인증되지 않은 요청입니다'),
  INVALID_EMAIL_FORMAT: new ErrorCode('INVALID_EMAIL_FORMAT', 400, '유효하지 않은 이메일 형식입니다'),
  WEAK_PASSWORD: new ErrorCode('WEAK_PASSWORD', 400, '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요'),
  MISSING_REQUIRED_FIELDS: new ErrorCode('MISSING_REQUIRED_FIELDS', 400, '필수 입력 항목이 누락되었습니다'),
  EMAIL_ALREADY_IN_USE: new ErrorCode('EMAIL_ALREADY_IN_USE', 409, '이미 사용 중인 이메일 주소입니다'),
  REGISTRATION_FAILED: new ErrorCode('REGISTRATION_FAILED', 500, '회원가입 처리 중 오류가 발생했습니다'),
  INVALID_NAME_FORMAT: new ErrorCode('INVALID_NAME_FORMAT', 400, '유효하지 않은 이름 형식입니다'),
  TERMS_NOT_AGREED: new ErrorCode('TERMS_NOT_AGREED', 400, '서비스 이용 약관에 동의해야 합니다'),
};
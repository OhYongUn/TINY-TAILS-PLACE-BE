export class ErrorCode {
  constructor(
    public code: string,
    public statusCode: number,
    public message: string,
  ) {}
}

export const UserErrorCodes = {
  USER_NOT_FOUND: new ErrorCode(
    'USER_NOT_FOUND',
    404,
    '사용자를 찾을 수 없습니다',
  ),
  EMAIL_ALREADY_EXISTS: new ErrorCode(
    'EMAIL_ALREADY_EXISTS',
    400,
    '이미 존재하는 이메일입니다',
  ),
  INVALID_PASSWORD: new ErrorCode(
    'INVALID_PASSWORD',
    400,
    '잘못된 비밀번호입니다',
  ),
  PROFILE_UPDATE_FAILED: new ErrorCode(
    'PROFILE_UPDATE_FAILED',
    400,
    '프로필 업데이트에 실패했습니다',
  ),
  WEAK_PASSWORD: new ErrorCode(
    'WEAK_PASSWORD',
    400,
    '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요',
  ),
};

export class ErrorCode {
  constructor(
    public statusCode: number,
    public message: string,
  ) {}
}

export const RoomErrorCodes = {
  ROOM_NOT_FOUND: new ErrorCode(404, '객실을 찾을 수 없습니다'),
  ROOM_NOT_AVAILABLE: new ErrorCode(
    400,
    '해당 날짜에 이용 가능한 객실이 없습니다',
  ),
  INVALID_DATE_RANGE: new ErrorCode(400, '잘못된 날짜 범위입니다'),
  CAPACITY_EXCEEDED: new ErrorCode(400, '객실 수용 인원을 초과했습니다'),
  // 추가 에러 코드들...
};

export class ErrorCode {
  constructor(
    public code: string, // 코드 필드 추가
    public statusCode: number,
    public message: string,
  ) {}
}

export const BookingErrorCodes = {
  BOOKING_NOT_FOUND: new ErrorCode(
    'BOOKING_NOT_FOUND',
    404,
    '예약을 찾을 수 없습니다',
  ),
  INVALID_BOOKING_DATE: new ErrorCode(
    'INVALID_BOOKING_DATE',
    400,
    '잘못된 예약 날짜입니다',
  ),
  BOOKING_CONFLICT: new ErrorCode(
    'BOOKING_CONFLICT',
    409,
    '해당 날짜에 이미 예약이 존재합니다',
  ),
  INSUFFICIENT_PAYMENT: new ErrorCode(
    'INSUFFICIENT_PAYMENT',
    400,
    '결제 금액이 부족합니다',
  ),
  BOOKING_CANCELLED: new ErrorCode(
    'BOOKING_CANCELLED',
    400,
    '이미 취소된 예약입니다',
  ),
  PAYMENT_NOT_FOUND: new ErrorCode(
    'PAYMENT_NOT_FOUND',
    404,
    '결제를 찾을 수 없습니다',
  ),
  PAYMENT_ALREADY_COMPLETED: new ErrorCode(
    'PAYMENT_ALREADY_COMPLETED',
    400,
    '결제가 이미 완료되었습니다',
  ),
  INVALID_PAYMENT_AMOUNT: new ErrorCode(
    'INVALID_PAYMENT_AMOUNT',
    400,
    '결제 금액이 올바르지 않습니다',
  ),
};

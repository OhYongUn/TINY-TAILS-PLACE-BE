import {
  BookingErrorCodes,
  ErrorCode,
} from '@apps/rest/booking/exceptions/error-codes';

export class BookingException extends Error {
  constructor(
    public errorCode: ErrorCode,
    message?: string,
  ) {
    super(message || errorCode.message);
    this.name = this.constructor.name;
  }
}

export class BookingNotFoundException extends BookingException {
  constructor() {
    super(BookingErrorCodes.BOOKING_NOT_FOUND);
  }
}

export class InvalidBookingDateException extends BookingException {
  constructor() {
    super(BookingErrorCodes.INVALID_BOOKING_DATE);
  }
}

export class BookingConflictException extends BookingException {
  constructor() {
    super(BookingErrorCodes.BOOKING_CONFLICT);
  }
}

export class InsufficientPaymentException extends BookingException {
  constructor() {
    super(BookingErrorCodes.INSUFFICIENT_PAYMENT);
  }
}

export class BookingCancelledException extends BookingException {
  constructor() {
    super(BookingErrorCodes.BOOKING_CANCELLED);
  }
}

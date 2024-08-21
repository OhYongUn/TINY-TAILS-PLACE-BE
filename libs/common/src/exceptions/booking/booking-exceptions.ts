import {AppException} from "@app/common/exceptions/base.exception";
import {BookingErrorCodes} from "@app/common/exceptions/booking/error-codes";

export const BookingExceptions = {
  bookingNotFound: () => new AppException(
      BookingErrorCodes.BOOKING_NOT_FOUND.code,
      BookingErrorCodes.BOOKING_NOT_FOUND.statusCode,
      BookingErrorCodes.BOOKING_NOT_FOUND.message
  ),
  invalidBookingDate: () => new AppException(
      BookingErrorCodes.INVALID_BOOKING_DATE.code,
      BookingErrorCodes.INVALID_BOOKING_DATE.statusCode,
      BookingErrorCodes.INVALID_BOOKING_DATE.message
  ),
  bookingConflict: () => new AppException(
      BookingErrorCodes.BOOKING_CONFLICT.code,
      BookingErrorCodes.BOOKING_CONFLICT.statusCode,
      BookingErrorCodes.BOOKING_CONFLICT.message
  ),
  insufficientPayment: () => new AppException(
      BookingErrorCodes.INSUFFICIENT_PAYMENT.code,
      BookingErrorCodes.INSUFFICIENT_PAYMENT.statusCode,
      BookingErrorCodes.INSUFFICIENT_PAYMENT.message
  ),
  bookingCancelled: () => new AppException(
      BookingErrorCodes.BOOKING_CANCELLED.code,
      BookingErrorCodes.BOOKING_CANCELLED.statusCode,
      BookingErrorCodes.BOOKING_CANCELLED.message
  ),
  paymentNotFound: () => new AppException(
      BookingErrorCodes.PAYMENT_NOT_FOUND.code,
      BookingErrorCodes.PAYMENT_NOT_FOUND.statusCode,
      BookingErrorCodes.PAYMENT_NOT_FOUND.message
  ),
  paymentAlreadyCompleted: () => new AppException(
      BookingErrorCodes.PAYMENT_ALREADY_COMPLETED.code,
      BookingErrorCodes.PAYMENT_ALREADY_COMPLETED.statusCode,
      BookingErrorCodes.PAYMENT_ALREADY_COMPLETED.message
  ),
  invalidPaymentAmount: () => new AppException(
      BookingErrorCodes.INVALID_PAYMENT_AMOUNT.code,
      BookingErrorCodes.INVALID_PAYMENT_AMOUNT.statusCode,
      BookingErrorCodes.INVALID_PAYMENT_AMOUNT.message
  ),
};
import {AppException} from "@app/common/exceptions/base.exception";
import {RoomErrorCodes} from "@app/common/exceptions/rooms/error-codes";

export const RoomExceptions = {
  roomNotFound: () => new AppException(
      RoomErrorCodes.ROOM_NOT_FOUND.code,
      RoomErrorCodes.ROOM_NOT_FOUND.statusCode,
      RoomErrorCodes.ROOM_NOT_FOUND.message
  ),
  roomNotAvailable: () => new AppException(
      RoomErrorCodes.ROOM_NOT_AVAILABLE.code,
      RoomErrorCodes.ROOM_NOT_AVAILABLE.statusCode,
      RoomErrorCodes.ROOM_NOT_AVAILABLE.message
  ),
  invalidDateRange: () => new AppException(
      RoomErrorCodes.INVALID_DATE_RANGE.code,
      RoomErrorCodes.INVALID_DATE_RANGE.statusCode,
      RoomErrorCodes.INVALID_DATE_RANGE.message
  ),
  capacityExceeded: () => new AppException(
      RoomErrorCodes.CAPACITY_EXCEEDED.code,
      RoomErrorCodes.CAPACITY_EXCEEDED.statusCode,
      RoomErrorCodes.CAPACITY_EXCEEDED.message
  ),
  // 추가 예외 팩토리 함수들...
};
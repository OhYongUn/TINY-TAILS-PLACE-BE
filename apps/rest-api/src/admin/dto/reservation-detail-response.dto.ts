import { ApiProperty } from '@nestjs/swagger';
import {
  BookingStatus,
  FeeType,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from '@prisma/client';

class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

class BookingDetailsDto {
  @ApiProperty()
  petCount: number;

  @ApiProperty({ required: false, nullable: true })
  request: string | null;

  @ApiProperty()
  requestedLateCheckout: boolean;

  @ApiProperty()
  requestedEarlyCheckin: boolean;

  @ApiProperty()
  actualLateCheckout: boolean;

  @ApiProperty()
  actualEarlyCheckin: boolean;
}

class StatusHistoryDto {
  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ required: false, nullable: true })
  reason: string | null;

  @ApiProperty()
  createdAt: string;
}

class PaymentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ enum: PaymentMethod })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentType })
  type: PaymentType;

  @ApiProperty({ required: false, nullable: true })
  transactionId: string | null;

  @ApiProperty()
  createdAt: string;
}

class AdditionalFeeDto {
  @ApiProperty({ enum: FeeType })
  feeType: FeeType;

  @ApiProperty()
  amount: number;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  createdAt: string;
}

export class ReservationDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  roomNumber: string;

  @ApiProperty()
  roomName: string;

  @ApiProperty()
  checkInDate: string;

  @ApiProperty()
  checkOutDate: string;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ required: false, nullable: true })
  cancellationDate: string | null;

  @ApiProperty({ required: false, nullable: true })
  cancellationFee: number | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  user: UserDto;

  @ApiProperty({ required: false, nullable: true })
  bookingDetails: BookingDetailsDto | null;

  @ApiProperty({ type: [StatusHistoryDto] })
  statusHistories: StatusHistoryDto[];

  @ApiProperty({ type: [PaymentDto] })
  payments: PaymentDto[];

  @ApiProperty({ type: [AdditionalFeeDto] })
  additionalFees: AdditionalFeeDto[];
}

export class ReservationDetailResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  statusCode: number;

  @ApiProperty({ type: ReservationDetailDto })
  data: ReservationDetailDto;

  @ApiProperty({ required: false, nullable: true })
  error: string | null;
}

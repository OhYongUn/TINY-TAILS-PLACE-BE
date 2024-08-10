import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { CreateBookingDto } from '@apps/rest/booking/dto/create-booking.dto';
import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  Prisma,
} from '@prisma/client';
import {
  BookingConflictException,
  BookingException,
  InsufficientPaymentException,
  InvalidBookingDateException,
} from '@apps/rest/booking/exceptions/booking-exceptions';
import { ErrorCode } from '@apps/rest/room/exceptions/error-codes';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBookingAndInitiatePayment(createBookingDto: CreateBookingDto) {
    try {
      const {
        userId,
        roomDetailId,
        checkInDate,
        checkOutDate,
        requestedLateCheckout,
        requestedEarlyCheckin,
        petCount,
        basePrice,
        additionalFees,
        totalPrice,
        specialRequests,
        status,
      } = createBookingDto;

      return this.prisma.$transaction(async (prisma) => {
        const isAvailable = await this.checkRoomAvailability(
          prisma,
          roomDetailId,
          checkInDate,
          checkOutDate,
        );
        if (!isAvailable) {
          throw new BookingConflictException();
        }
        if (new Date(checkInDate) >= new Date(checkOutDate)) {
          throw new InvalidBookingDateException();
        }
        if (totalPrice < basePrice + additionalFees) {
          throw new InsufficientPaymentException();
        }
        // Booking 생성
        const booking = await prisma.booking.create({
          data: {
            userId,
            roomDetailId,
            checkInDate,
            checkOutDate,
            requestedLateCheckout,
            requestedEarlyCheckin,
            petCount,
            basePrice,
            additionalFees,
            totalPrice,
            specialRequests,
            status: status || BookingStatus.PENDING,
          },
        });

        // Payment 생성
        const payment = await prisma.payment.create({
          data: {
            amount: totalPrice, // basePrice 대신 totalPrice 사용
            status: PaymentStatus.PENDING, // 열거형 사용 권장
            method: PaymentMethod.CREDIT_CARD, // 열거형 사용 권장
            type: PaymentType.INITIAL, // 열거형 사용 권장
            bookingId: booking.id,
          },
        });
        // RoomAvailability 업데이트
        await this.updateRoomAvailability(
          prisma,
          roomDetailId,
          checkInDate,
          checkOutDate,
          -1,
        );

        return { booking, payment, amountToPay: totalPrice }; // basePrice 대신 totalPrice 반환
      });
    } catch (error) {
      if (!(error instanceof BookingException)) {
        throw new BookingException(
          new ErrorCode('INTERNAL_SERVER_ERROR', 500, 'Internal Server Error'),
          'An unexpected error occurred',
        );
      }
      throw error;
    }
  }

  // 가용성 체크 메서드
  private async checkRoomAvailability(
    prisma: Prisma.TransactionClient,
    roomDetailId: number,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<boolean> {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const availabilities = await prisma.roomAvailability.findMany({
      where: {
        roomDetailId,
        date: {
          gte: checkIn,
          lt: checkOut,
        },
        availableCount: { gt: 0 },
      },
    });

    const requiredDays = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return availabilities.length === requiredDays;
  }

  // RoomAvailability 업데이트 메서드
  private async updateRoomAvailability(
    prisma: Prisma.TransactionClient,
    roomDetailId: number,
    checkInDate: Date,
    checkOutDate: Date,
    changeAmount: number,
  ): Promise<void> {
    const dates = this.getDatesInRange(checkInDate, checkOutDate);
    for (const date of dates) {
      await prisma.roomAvailability.updateMany({
        where: {
          roomDetailId,
          date,
        },
        data: {
          availableCount: { increment: changeAmount },
        },
      });
    }
  }

  private getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
}

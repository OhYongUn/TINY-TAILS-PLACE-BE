import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { CreateBookingDto } from '@apps/rest/booking/dto/create-booking.dto';
import { BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBookingAndInitiatePayment(createBookingDto: CreateBookingDto) {
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
      // 방 가용성 확인
      const isAvailable = await this.checkRoomAvailability(
        prisma,
        roomDetailId,
        checkInDate,
        checkOutDate,
      );
      if (!isAvailable) {
        throw new BadRequestException(
          'Room is not available for the selected dates',
        );
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
          method: PaymentMethod.INITIAL, // 열거형 사용 권장
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
  }

  // 가용성 체크 메서드
  private async checkRoomAvailability(
    prisma: Prisma.TransactionClient,
    roomDetailId: number,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<boolean> {
    const availabilities = await prisma.roomAvailability.findMany({
      where: {
        roomDetailId,
        date: {
          gte: checkInDate,
          lt: checkOutDate,
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
    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
}

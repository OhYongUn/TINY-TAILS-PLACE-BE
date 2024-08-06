// booking.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { CancelBookingDto } from '@apps/rest/booking/dto/cancel-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async initiateBooking(createBookingDto: CreateBookingDto) {
    const {
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      requestedLateCheckout,
      requestedEarlyCheckin,
      petCount,
      specialRequests,
    } = createBookingDto;

    return this.prisma.$transaction(async (prisma) => {
      // 방 가용성 확인
      const isAvailable = await this.checkRoomAvailability(
        roomId,
        checkInDate,
        checkOutDate,
      );
      if (!isAvailable) {
        throw new BadRequestException(
          'Room is not available for the selected dates',
        );
      }

      // 기본 가격 계산
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      if (!room || typeof room.basePrice !== 'number') {
        throw new NotFoundException('Room not found or has invalid base price');
      }
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24),
      );
      const basePrice = room.basePrice * nights;

      // Booking 임시 생성
      const booking = await prisma.booking.create({
        data: {
          userId,
          roomId,
          checkInDate,
          checkOutDate,
          requestedLateCheckout,
          requestedEarlyCheckin,
          petCount,
          basePrice,
          totalPrice: basePrice,
          status: 'PENDING',
          specialRequests,
        },
      });

      // RoomAvailability 업데이트
      await this.updateRoomAvailability(
        prisma,
        roomId,
        checkInDate,
        checkOutDate,
        -1,
      );

      return { booking, amountToPay: basePrice };
    });
  }

  async cancelBooking(cancelBookingDto: CancelBookingDto) {
    const { bookingId } = cancelBookingDto;

    return this.prisma.$transaction(async (prisma) => {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { payments: true },
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      if (booking.status !== 'CONFIRMED') {
        throw new BadRequestException('Booking is not in a confirmed state');
      }

      const cancellationFee = await this.calculateCancellationFee(booking);
      const refundAmount = booking.totalPrice - cancellationFee;

      // 취소 처리
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });

      // RoomAvailability 복원
      await this.updateRoomAvailability(
        prisma,
        booking.roomId,
        booking.checkInDate,
        booking.checkOutDate,
        1,
      );

      // 환불 처리
      if (refundAmount > 0) {
        await prisma.payment.create({
          data: {
            bookingId: bookingId,
            amount: refundAmount,
            status: 'COMPLETED',
            method: 'REFUND',
            type: 'REFUND',
          },
        });
      }

      // 취소 수수료 처리
      if (cancellationFee > 0) {
        await prisma.payment.create({
          data: {
            bookingId: bookingId,
            amount: cancellationFee,
            status: 'COMPLETED',
            method: 'CANCELLATION_FEE',
            type: 'CANCELLATION_FEE',
          },
        });
      }

      return {
        booking: updatedBooking,
        cancellationFee,
        refundAmount,
      };
    });
  }

  private async checkRoomAvailability(
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<boolean> {
    const availabilities = await this.prisma.roomAvailability.findMany({
      where: {
        roomId,
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

  private async calculateCancellationFee(booking: any): Promise<number> {
    const now = new Date();
    const checkInDate = new Date(booking.checkInDate);
    const daysUntilCheckIn = Math.ceil(
      (checkInDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
    );

    if (daysUntilCheckIn > 14) {
      return 0; // 전액 환불
    } else if (daysUntilCheckIn > 7) {
      return booking.totalPrice * 0.1; // 10% 수수료
    } else if (daysUntilCheckIn > 3) {
      return booking.totalPrice * 0.3; // 30% 수수료
    } else if (daysUntilCheckIn > 1) {
      return booking.totalPrice * 0.5; // 50% 수수료
    } else {
      return booking.totalPrice; // 환불 불가
    }
  }

  private async updateRoomAvailability(
    prisma: any,
    roomId: number,
    checkInDate: Date,
    checkOutDate: Date,
    changeAmount: number,
  ) {
    const dates = this.getDatesInRange(checkInDate, checkOutDate);
    for (const date of dates) {
      await prisma.roomAvailability.updateMany({
        where: {
          roomId: roomId,
          date: date,
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

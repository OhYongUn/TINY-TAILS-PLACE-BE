import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  Prisma,
} from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async processPayment(
    prisma: Prisma.TransactionClient,
    bookingId: string,
    basePrice: number,
    additionalFees: number,
  ) {
    const basePricePayment = await prisma.payment.create({
      data: {
        amount: basePrice,
        status: PaymentStatus.PENDING,
        method: PaymentMethod.CREDIT_CARD,
        type: PaymentType.INITIAL,
        bookingId: bookingId,
      },
    });

    let additionalFeesPayment = null;
    if (additionalFees > 0) {
      additionalFeesPayment = await prisma.payment.create({
        data: {
          amount: additionalFees,
          status: PaymentStatus.PENDING,
          method: PaymentMethod.CREDIT_CARD,
          type: PaymentType.ADDITIONAL,
          bookingId: bookingId,
        },
      });
    }

    return { basePricePayment, additionalFeesPayment };
  }

  /* async processPayment(bookingId: number, paymentMethod: string) {
     return this.prisma.$transaction(async (prisma) => {
       const booking = await prisma.booking.findUnique({
         where: { id: bookingId },
       });
       if (!booking || booking.status !== 'PENDING') {
         throw new BadRequestException('Invalid booking');
       }

       // Payment 생성
       const payment = await prisma.payment.create({
         data: {
           amount: booking.basePrice,
           status: 'PENDING',
           method: paymentMethod,
           type: 'INITIAL',
           bookingId: booking.id,
         },
       });

       // 여기서 실제 결제 게이트웨이 호출
       // 결제 성공 가정
       const paymentSuccessful = true;

       if (paymentSuccessful) {
         // Payment 상태 업데이트
         await prisma.payment.update({
           where: { id: payment.id },
           data: { status: 'COMPLETED' },
         });

         // Booking 상태 업데이트
         await prisma.booking.update({
           where: { id: booking.id },
           data: { status: 'CONFIRMED' },
         });

         // RoomAvailability 업데이트
         await this.updateRoomAvailability(
           prisma,
           booking.roomId,
           booking.checkInDate,
           booking.checkOutDate,
           -1,
         );

         return { success: true, booking, payment };
       } else {
         // 결제 실패 처리
         await prisma.payment.update({
           where: { id: payment.id },
           data: { status: 'FAILED' },
         });

         // Booking 상태 업데이트 (선택적)
         await prisma.booking.update({
           where: { id: booking.id },
           data: { status: 'PAYMENT_FAILED' },
         });

         return { success: false, reason: 'Payment failed' };
       }
     });
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
   async createBookingAndInitiatePayment(createBookingDto: CreateBookingDto) {
     const {
       userId,
       roomId,
       checkInDate,
       checkOutDate,
       requestedLateCheckout,
       requestedEarlyCheckin,
       petCount,
       specialRequests,
       paymentMethod,
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

       // Booking 생성
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

       // Payment 생성
       const payment = await prisma.payment.create({
         data: {
           amount: basePrice,
           status: 'PENDING',
           method: paymentMethod,
           type: 'INITIAL',
           bookingId: booking.id,
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

       return { booking, payment, amountToPay: basePrice };
     });
   }*/
}

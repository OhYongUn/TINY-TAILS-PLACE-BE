import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { CreateBookingDto } from '@apps/rest/booking/dto/create-booking.dto';
import {
  Booking,
  BookingStatus,
  PaymentStatus,
  Prisma,
  RefundStatus,
  User,
} from '@prisma/client';
import {
  BookingCancelledException,
  BookingConflictException,
  BookingException,
  BookingNotFoundException,
  InsufficientPaymentException,
  InvalidBookingDateException,
  InvalidPaymentAmountException,
  PaymentAlreadyCompletedException,
  PaymentNotFoundException,
} from '@apps/rest/booking/exceptions/booking-exceptions';
import { ErrorCode } from '@apps/rest/room/exceptions/error-codes';
import { PaymentService } from '@apps/rest/payment/payment.service';
import { ConfirmPaymentDto } from '@apps/rest/payment/dto/confirm-payment.dto';
import { BookingQueryDto } from '@apps/rest/booking/dto/booking-query.dto';
import { CancelBookingDto } from '@apps/rest/booking/dto/booking-cancel.dto';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}

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
        request,
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
            basePrice,
            totalPrice,
            additionalFees,
            status: status || BookingStatus.PENDING,
            bookingDetails: {
              create: {
                petCount,
                request,
                requestedLateCheckout,
                requestedEarlyCheckin,
              },
            },
          },
          include: {
            bookingDetails: true,
          },
        });

        // Payment 생성
        const { basePricePayment, additionalFeesPayment } =
          await this.paymentService.processPayment(
            prisma, // 트랜잭션 내의 prisma 인스턴스를 전달
            booking.id,
            basePrice,
            additionalFees,
          );
        await prisma.bookingStatusHistory.create({
          data: {
            bookingId: booking.id,
            status: BookingStatus.PENDING,
            reason: 'Initial booking',
          },
        });
        console.log('boking', booking);
        console.log('basePricePayment', basePricePayment);
        console.log('additionalFeesPayment', additionalFeesPayment);
        return { booking, payment: basePricePayment, additionalFeesPayment };
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

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const { paymentId, amount, transactionId, bookingId } = confirmPaymentDto;

    return this.prisma.$transaction(async (prisma) => {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          roomDetail: true, // roomDetail을 포함해서 가져옴
        },
      });
      if (!booking) {
        throw new BookingNotFoundException();
      }
      if (booking.basePrice !== amount) {
        throw new InvalidPaymentAmountException();
      }
      const { checkInDate, checkOutDate, roomDetailId } = booking;

      const isAvailable = await this.checkRoomAvailability(
        prisma,
        roomDetailId,
        checkInDate,
        checkOutDate,
      );
      if (!isAvailable) {
        throw new BookingConflictException();
      }
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
      });

      if (!payment) {
        throw new PaymentNotFoundException();
      }

      if (payment.status === PaymentStatus.COMPLETED) {
        throw new PaymentAlreadyCompletedException();
      }
      // 3. Payment 업데이트
      const updatePayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.COMPLETED,
          transactionId,
        },
      });

      if (!updatePayment) {
        throw new Error('Payment not found');
      }

      // 4. Booking 상태 업데이트
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
        },
        include: {
          roomDetail: true,
        },
      });

      //  BookingStatusHistory 추가
      await prisma.bookingStatusHistory.create({
        data: {
          bookingId: bookingId,
          status: BookingStatus.CONFIRMED,
          reason: 'Payment confirmed',
        },
      });

      // RoomAvailability 업데이트 (필요한 경우)
      await this.updateRoomAvailability(
        prisma,
        roomDetailId,
        checkInDate,
        checkOutDate,
        -1,
      );
      return {
        booking: updatedBooking,
        payment,
      };
    });
  }

  async getBookings(userId: number, query: BookingQueryDto) {
    const whereCondition = this.buildWhereCondition(userId, query);
    const orderBy = this.buildOrderBy(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [bookings, totalCount] = await Promise.all([
      this.prisma.booking.findMany({
        where: whereCondition,
        orderBy: orderBy,
        skip: skip,
        take: pageSize,
        include: {
          roomDetail: {
            include: {
              room: true, // roomDetail에서 room 정보를 함께 가져옵니다.
            },
          },
          bookingDetails: true,
        },
      }),
      this.prisma.booking.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      bookings: bookings,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getBookingDetail(bookingId: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        roomDetail: true,
        bookingDetails: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: true,
        statusHistories: {
          orderBy: {
            createdAt: 'desc' as const,
          },
        },
      },
    } as Prisma.BookingFindUniqueArgs);

    return booking;
  }

  async cancelBooking(cancelBookingDto: CancelBookingDto, user: User) {
    const { bookingId, reason } = cancelBookingDto;
    return this.prisma.$transaction(async (prisma) => {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { payments: true },
      });

      if (!booking) {
        throw new BookingNotFoundException();
      }

      if (booking.status === BookingStatus.CANCELLED) {
        throw new BookingCancelledException();
      }

      const now = new Date();
      const checkInDate = new Date(booking.checkInDate);
      const daysDifference = Math.ceil(
        (checkInDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
      );

      const cancellationPolicy = await prisma.cancellationPolicy.findFirst({
        where: {
          daysBeforeCheckin: { lte: daysDifference },
        } as Prisma.CancellationPolicyWhereInput,
        orderBy: {
          daysBeforeCheckin: 'desc',
        } as Prisma.CancellationPolicyOrderByWithRelationInput,
      });

      const cancellationFee = cancellationPolicy
        ? (booking.basePrice * cancellationPolicy.feePercentage) / 100
        : 0;

      const refundAmount = booking.basePrice - cancellationFee;

      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancellationDate: now,
          cancellationFee: cancellationFee,
        },
      });

      await prisma.bookingStatusHistory.create({
        data: {
          bookingId: bookingId,
          status: BookingStatus.CANCELLED,
          reason: reason,
        },
      });

      if (refundAmount > 0) {
        await prisma.refund.create({
          data: {
            bookingId: bookingId,
            amount: refundAmount,
            status: RefundStatus.PENDING,
            reason: reason,
          },
        });
      }

      // RoomAvailability 업데이트
      await this.updateRoomAvailability(
        prisma,
        booking.roomDetailId,
        booking.checkInDate,
        booking.checkOutDate,
        1,
      );

      return {
        booking: updatedBooking,
        cancellationFee,
        refundAmount,
      };
    });
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

  private buildWhereCondition(
    userId: number,
    query: BookingQueryDto,
  ): Prisma.BookingWhereInput {
    const whereCondition: Prisma.BookingWhereInput = { userId };

    if (query.status) {
      whereCondition.status = Array.isArray(query.status)
        ? { in: query.status }
        : query.status;
    }

    if (query.dateFrom || query.dateTo) {
      const dateField =
        query.dateType === 'checkIn' ? 'checkInDate' : 'checkOutDate';
      const dateFilter: Prisma.DateTimeFilter = {};

      if (query.dateFrom) {
        dateFilter.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        dateFilter.lte = new Date(query.dateTo);
      }

      whereCondition[dateField] = dateFilter;
    }

    return whereCondition;
  }

  private buildOrderBy(
    query: BookingQueryDto,
  ): Prisma.BookingOrderByWithRelationInput {
    const orderBy: Prisma.BookingOrderByWithRelationInput = {};
    if (query.orderBy) {
      orderBy[query.orderBy] = query.order || 'desc';
    } else {
      orderBy[query.dateType === 'checkIn' ? 'checkInDate' : 'checkOutDate'] =
        query.order || 'desc';
    }
    return orderBy;
  }
}

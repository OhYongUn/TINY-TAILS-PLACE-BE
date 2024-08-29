import { Injectable, NotFoundException } from '@nestjs/common';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  startOfMonth,
} from 'date-fns';
import { PrismaService } from '@app/common/prisma/prisma.service';
import {
  RoomDto,
  RoomStatusDto,
  RoomStatusResponseDto,
} from '@apps/rest/admin/dto/booking/room-status-response.dto';
import { BookingStatus, Prisma } from '@prisma/client';
import { ReservationDetailResponseDto } from '@apps/rest/admin/dto/reservation-detail-response.dto';
import { GetBookingsDto } from '@apps/rest/admin/dto/booking/get-bookings.dto';

@Injectable()
export class AdminBookingsService {
  constructor(private prisma: PrismaService) {}

  async getReservations(
    year: number,
    month: number,
  ): Promise<RoomStatusResponseDto> {
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(startDate);

    const roomDetails = await this.prisma.roomDetail.findMany({
      include: {
        room: true,
      },
    });

    const bookings = await this.prisma.booking.findMany({
      where: {
        AND: [
          {
            checkInDate: { lte: endDate },
          },
          {
            checkOutDate: { gte: startDate },
          },
          {
            status: {
              in: [
                BookingStatus.CONFIRMED,
                BookingStatus.CHECKED_IN,
                BookingStatus.CHECKED_OUT,
              ],
            },
          },
        ],
      },
      include: {
        roomDetail: true,
      },
    });

    const rooms: RoomDto[] = roomDetails.map((roomDetail) => {
      const roomBookings = bookings.filter(
        (booking) => booking.roomDetailId === roomDetail.id,
      );

      const status: RoomStatusDto[] = eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).map((date) => {
        const bookingForDate = roomBookings.find((booking) =>
          isWithinInterval(date, {
            start: booking.checkInDate,
            end: new Date(booking.checkOutDate.getTime() - 1),
          }),
        );

        return {
          date: format(date, 'yyyy-MM-dd'),
          status: bookingForDate ? bookingForDate.status : null,
          bookingId: bookingForDate ? bookingForDate.id : null,
        };
      });

      return {
        id: roomDetail.id,
        roomNumber: roomDetail.roomNumber,
        name: roomDetail.room.name,
        status,
      };
    });

    return {
      year,
      month,
      rooms,
    };
  }

  async getReservationDetail(
    bookingId: string,
  ): Promise<ReservationDetailResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        roomDetail: {
          include: {
            room: true,
          },
        },
        bookingDetails: true,
        statusHistories: true,
        payments: true,
        AdditionalFee: true,
        refunds: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        id: booking.id,
        userId: booking.userId,
        roomNumber: booking.roomDetail.roomNumber,
        roomName: booking.roomDetail.room.name,
        checkInDate: booking.checkInDate.toISOString(),
        checkOutDate: booking.checkOutDate.toISOString(),
        basePrice: booking.basePrice,
        totalPrice: booking.totalPrice,
        status: booking.status,
        cancellationDate: booking.cancellationDate
          ? booking.cancellationDate.toISOString()
          : null,
        cancellationFee: booking.cancellationFee ?? null,
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        user: {
          id: booking.user.id,
          name: booking.user.name,
          email: booking.user.email,
          phone: booking.user.phone,
        },
        bookingDetails: booking.bookingDetails
          ? {
              petCount: booking.bookingDetails.petCount,
              request: booking.bookingDetails.request,
              requestedLateCheckout:
                booking.bookingDetails.requestedLateCheckout,
              requestedEarlyCheckin:
                booking.bookingDetails.requestedEarlyCheckin,
              actualLateCheckout: booking.bookingDetails.actualLateCheckout,
              actualEarlyCheckin: booking.bookingDetails.actualEarlyCheckin,
            }
          : null,
        statusHistories: booking.statusHistories.map((history) => ({
          status: history.status,
          reason: history.reason,
          createdAt: history.createdAt.toISOString(),
        })),
        payments: booking.payments.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          method: payment.method,
          type: payment.type,
          transactionId: payment.transactionId,
          createdAt: payment.createdAt.toISOString(),
          updatedAt: payment.updatedAt.toISOString(),
        })),
        additionalFees: booking.AdditionalFee.map((fee) => ({
          feeType: fee.feeType,
          amount: fee.amount,
          description: fee.description,
          createdAt: fee.createdAt.toISOString(),
        })),
        // refunds 정보도 필요하다면 여기에 추가
      },
      error: null,
    };
  }

  async getBookings(params: GetBookingsDto) {
    console.log('params', params);
    const {
      fromDate,
      toDate,
      searchOption,
      searchQuery,
      sortOption,
      status,
      page = 1,
      pageSize = 10,
    } = params;

    const where: Prisma.BookingWhereInput = {
      AND: [
        { status: { not: BookingStatus.PENDING } },
        status ? { status } : {},
      ],
    };

    if (fromDate && toDate) {
      where.checkInDate = { gte: new Date(fromDate) };
      where.checkOutDate = { lte: new Date(toDate) };
    }

    if (searchOption && searchQuery) {
      switch (searchOption) {
        case 'userName':
          where.user = { name: { contains: searchQuery } };
          break;
        case 'phone':
          where.user = { phone: { contains: searchQuery } };
          break;
        case 'roomNumber':
          where.roomDetail = { roomNumber: { contains: searchQuery } };
          break;
      }
    }

    let orderBy: Prisma.BookingOrderByWithRelationInput = { createdAt: 'desc' };

    if (sortOption) {
      const [field, direction] = sortOption.split('_') as [
        string,
        Prisma.SortOrder,
      ];
      if (field === 'roomNumber') {
        orderBy = { roomDetail: { roomNumber: direction } };
      } else if (field in Prisma.BookingScalarFieldEnum) {
        orderBy = { [field]: direction };
      }
    }

    const totalCount = await this.prisma.booking.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);

    const bookings = await this.prisma.booking.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        roomDetail: {
          select: {
            id: true,
            roomNumber: true,
          },
        },
      },
    });

    return {
      bookings,
      totalPages,
      currentPage: page,
      totalCount,
    };
  }
}

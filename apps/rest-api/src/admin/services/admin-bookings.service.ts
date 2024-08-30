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
import { ReservationDetailType } from '@apps/rest/admin/types/type';
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

  async getReservationDetail(
    bookingId: string,
    types?: Array<'all' | ReservationDetailType>,
  ): Promise<ReservationDetailResponseDto> {
    const shouldIncludeAll = types?.includes('all');
    const typesToInclude = new Set<ReservationDetailType>(
      shouldIncludeAll
        ? [
            'bookingDetails',
            'statusHistories',
            'payments',
            'additionalFees',
            'user',
            'roomDetail',
          ]
        : (types || []).filter(
            (type): type is ReservationDetailType => type !== 'all',
          ),
    );

    const booking = await this.getBooking(bookingId, typesToInclude);

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    const responseData: any = {
      base: this.getBaseDetails(booking),
    };

    if (typesToInclude.has('bookingDetails') && booking.bookingDetails) {
      responseData.bookingDetails = this.getBookingDetails(booking);
    }

    if (typesToInclude.has('statusHistories')) {
      responseData.statusHistories = this.getStatusHistories(booking);
    }

    if (typesToInclude.has('payments')) {
      responseData.payments = this.getPayments(booking);
      responseData.refunds = this.getRefunds(booking);
    }

    if (typesToInclude.has('additionalFees')) {
      responseData.additionalFees = this.getAdditionalFees(booking);
    }

    if (typesToInclude.has('user')) {
      responseData.user = this.getUser(booking);
    }

    if (typesToInclude.has('roomDetail')) {
      responseData.roomDetail = this.getRoomDetail(booking);
    }

    return {
      success: true,
      statusCode: 200,
      data: responseData,
      error: null,
    };
  }

  private async getBooking(bookingId: string, typesToInclude: Set<string>) {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: typesToInclude.has('user'),
        roomDetail: typesToInclude.has('roomDetail')
          ? {
              include: { room: true },
            }
          : false,
        bookingDetails: typesToInclude.has('bookingDetails'),
        statusHistories: typesToInclude.has('statusHistories'),
        payments: typesToInclude.has('payments'),
        AdditionalFee: typesToInclude.has('additionalFees'),
        refunds: typesToInclude.has('payments'),
      },
    });
  }

  private getBaseDetails(booking: any) {
    return {
      id: booking.id,
      userId: booking.userId,
      roomDetailId: booking.roomDetailId,
      checkInDate: booking.checkInDate.toISOString(),
      checkOutDate: booking.checkOutDate.toISOString(),
      basePrice: booking.basePrice,
      totalPrice: booking.totalPrice,
      status: booking.status,
      cancellationDate: booking.cancellationDate
        ? booking.cancellationDate.toISOString()
        : null,
      cancellationFee: booking.cancellationFee,
      additionalFees: booking.additionalFees,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }

  private getBookingDetails(booking: any) {
    return booking.bookingDetails;
  }

  private getStatusHistories(booking: any) {
    return booking.statusHistories.map((history: any) => ({
      ...history,
      createdAt: history.createdAt.toISOString(),
    }));
  }

  private getPayments(booking: any) {
    return booking.payments.map((payment: any) => ({
      ...payment,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    }));
  }

  private getRefunds(booking: any) {
    return booking.refunds.map((refund: any) => ({
      ...refund,
      createdAt: refund.createdAt.toISOString(),
    }));
  }

  private getAdditionalFees(booking: any) {
    return booking.AdditionalFee.map((fee: any) => ({
      ...fee,
      createdAt: fee.createdAt.toISOString(),
    }));
  }

  private getUser(booking: any) {
    return booking.user;
  }

  private getRoomDetail(booking: any) {
    return {
      id: booking.roomDetail.id,
      roomNumber: booking.roomDetail.roomNumber,
      roomName: booking.roomDetail.room.name,
    };
  }
}

import { Injectable } from '@nestjs/common';
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
import { BookingStatus } from '@prisma/client';

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
}

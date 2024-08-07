import { Injectable } from '@nestjs/common';
import { AvailableRoomsDto } from './dto/available-rooms.dto';
import { RoomDto } from './dto/room.dto';
import { PrismaService } from '@app/common/prisma/prisma.service';
import {
  InvalidDateRangeException,
  RoomException,
  RoomNotAvailableException,
  RoomNotFoundException,
} from '@apps/rest/room/exceptions/room-exceptions';
import { RoomErrorCodes } from '@apps/rest/room/exceptions/error-codes';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findAvailableRooms(params: AvailableRoomsDto): Promise<RoomDto[]> {
    const { checkInDate, checkOutDate } = params;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const dayCount = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24),
    );

    if (checkIn >= checkOut) {
      throw new InvalidDateRangeException(RoomErrorCodes.INVALID_DATE_RANGE);
    }

    try {
      const availableRooms = await this.prisma.room.findMany({
        where: {
          availabilities: {
            some: {
              date: {
                gte: checkIn,
                lt: checkOut,
              },
              availableCount: {
                gt: 0,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          class: true,
          size: true,
          basePrice: true,
          imageUrls: true,
          description: true,
          capacity: true,
          availabilities: {
            where: {
              date: {
                gte: checkIn,
                lt: checkOut,
              },
              availableCount: {
                gt: 0,
              },
            },
            select: {
              date: true,
              availableCount: true,
            },
          },
        },
      });
      if (availableRooms.length === 0) {
        throw new RoomNotAvailableException(
          RoomErrorCodes.ROOM_NOT_AVAILABLE,
          '해당 날짜에 이용 가능한 객실이 없습니다',
        );
      }
      console.log('Query result:', availableRooms);

      const filteredRooms = availableRooms.filter(
        (room) => room.availabilities.length === dayCount,
      );

      if (filteredRooms.length === 0) {
        throw new RoomNotAvailableException(
          RoomErrorCodes.ROOM_NOT_AVAILABLE,
          '전체 숙박 기간 동안 완전히 이용 가능한 객실이 없습니다',
        );
      }

      return filteredRooms.map(
        (room): RoomDto => ({
          id: room.id,
          name: room.name,
          class: room.class,
          description: room.description,
          capacity: room.capacity,
          basePrice: room.basePrice,
          size: room.size,
          imageUrls: room.imageUrls,
          availableDates: room.availabilities.map((a) => a.date),
          availableCounts: room.availabilities.map((a) => a.availableCount),
        }),
      );
    } catch (error) {
      if (error instanceof RoomException) {
        throw error;
      }
      throw new RoomNotFoundException(
        RoomErrorCodes.ROOM_NOT_FOUND,
        '이용 가능한 객실을 찾는 중 오류가 발생했습니다',
      );
    }
  }
}

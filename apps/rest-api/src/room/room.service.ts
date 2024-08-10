import { Injectable } from '@nestjs/common';
import { SearchRoomsDto } from './dto/search-rooms.dto';
import { PrismaService } from '@app/common/prisma/prisma.service';
import {
  InvalidDateRangeException,
  RoomException,
  RoomNotFoundException,
} from '@apps/rest/room/exceptions/room-exceptions';
import { RoomErrorCodes } from '@apps/rest/room/exceptions/error-codes';
import { AvailableRoomClassDto } from '@apps/rest/room/dto/available-room-class.dto';
import { UpdateRoomDto } from '@apps/rest/room/dto/update-room.dto';
import { CreateRoomDto } from '@apps/rest/room/dto/create-room.dto';
import { Room } from '@apps/rest/room/dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findAvailableRooms(
    params: SearchRoomsDto,
  ): Promise<AvailableRoomClassDto[]> {
    const { checkInDate, checkOutDate } = params;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      throw new InvalidDateRangeException(RoomErrorCodes.INVALID_DATE_RANGE);
    }

    try {
      const availableRooms = await this.prisma.room.findMany({
        where: {
          roomDetails: {
            some: {
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
          },
        },
        include: {
          roomDetails: {
            include: {
              availabilities: {
                where: {
                  date: {
                    gte: checkIn,
                    lt: checkOut,
                  },
                },
              },
            },
          },
          prices: {
            where: {
              startDate: { lte: checkOut },
              endDate: { gte: checkIn },
            },
          },
        },
      });

      const roomClasses: AvailableRoomClassDto[] = availableRooms.map(
        (room) => {
          const availableRoomDetails = room.roomDetails
            .filter((detail) =>
              detail.availabilities.every((a) => a.availableCount > 0),
            )
            .map((detail) => ({
              id: detail.id,
              roomNumber: detail.roomNumber,
            }));

          // 해당 기간 동안의 가격 계산
          const price = room.prices.reduce((acc, curr) => {
            const overlapStart = new Date(
              Math.max(curr.startDate.getTime(), checkIn.getTime()),
            );
            const overlapEnd = new Date(
              Math.min(curr.endDate.getTime(), checkOut.getTime()),
            );
            const days = Math.ceil(
              (overlapEnd.getTime() - overlapStart.getTime()) /
                (1000 * 60 * 60 * 24),
            );
            return acc + curr.price * days;
          }, 0);

          return {
            id: room.id,
            name: room.name,
            class: room.class,
            description: room.description,
            capacity: room.capacity,
            size: room.size,
            imageUrls: room.imageUrls,
            availableCount: availableRoomDetails.length,
            availableRoomDetails: availableRoomDetails,
            price: price, // 계산된 가격 추가
          };
        },
      );

      return roomClasses;
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

  create(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({
      data: createRoomDto,
    });
  }

  async findAll(): Promise<Room[]> {
    return this.prisma.room.findMany();
  }

  findOne(id: number) {
    return this.prisma.roomDetail.findUnique({
      where: { id },
      include: { room: true },
    });
  }

  update(id: number, UpdateRoomDto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: UpdateRoomDto,
    });
  }

  remove(id: number) {
    return this.prisma.roomDetail.delete({
      where: { id },
    });
  }
}

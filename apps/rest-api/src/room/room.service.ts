import { Injectable } from '@nestjs/common';
import { SearchRoomsDto } from './dto/search-rooms.dto';
import { RoomDto } from './dto/room.dto';
import { PrismaService } from '@app/common/prisma/prisma.service';
import {
  InvalidDateRangeException,
  RoomException,
  RoomNotAvailableException,
  RoomNotFoundException,
} from '@apps/rest/room/exceptions/room-exceptions';
import { RoomErrorCodes } from '@apps/rest/room/exceptions/error-codes';
import { CreateRoomDto } from '@apps/rest/room/dto/create-room.dto';
import { UpdateRoomDto } from '@apps/rest/room/dto/ update-room.dto';
import { AvailableRoomClassDto } from '@apps/rest/room/dto/available-room-class.dto';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findAvailableRooms(
    params: SearchRoomsDto,
  ): Promise<AvailableRoomClassDto[]> {
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
        include: {
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
          },
        },
      });

      if (availableRooms.length === 0) {
        throw new RoomNotAvailableException(
          RoomErrorCodes.ROOM_NOT_AVAILABLE,
          '해당 날짜에 이용 가능한 객실이 없습니다',
        );
      }

      const filteredRooms = availableRooms.filter(
        (room) => room.availabilities.length === dayCount,
      );

      if (filteredRooms.length === 0) {
        throw new RoomNotAvailableException(
          RoomErrorCodes.ROOM_NOT_AVAILABLE,
          '전체 숙박 기간 동안 완전히 이용 가능한 객실이 없습니다',
        );
      }

      const roomClasses = filteredRooms.reduce(
        (acc, room) => {
          if (!acc[room.class]) {
            acc[room.class] = {
              class: room.class,
              name: room.name,
              description: room.description,
              capacity: room.capacity,
              basePrice: room.basePrice,
              size: room.size,
              imageUrls: room.imageUrls,
              availableRooms: 0,
              availableDates: room.availabilities.map((a) => a.date),
              availableCounts: room.availabilities.map((a) => a.availableCount),
            };
          }
          acc[room.class].availableRooms += 1;
          return acc;
        },
        {} as Record<string, AvailableRoomClassDto>,
      );

      return Object.values(roomClasses);
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

  async createRoom(createRoomDto: CreateRoomDto): Promise<RoomDto> {
    const room = await this.prisma.room.create({
      data: createRoomDto,
    });
    return this.mapToRoomDto(room);
  }

  async getRoom(id: number): Promise<RoomDto> {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
    if (!room) {
      throw new RoomNotFoundException(RoomErrorCodes.ROOM_NOT_FOUND);
    }
    return this.mapToRoomDto(room);
  }

  async updateRoom(id: number, updateRoomDto: UpdateRoomDto): Promise<RoomDto> {
    const room = await this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
    return this.mapToRoomDto(room);
  }

  async deleteRoom(id: number): Promise<void> {
    await this.prisma.room.delete({
      where: { id },
    });
  }

  private mapToRoomDto(room: any): RoomDto {
    return {
      id: room.id,
      name: room.name,
      class: room.class,
      description: room.description,
      capacity: room.capacity,
      basePrice: room.basePrice,
      size: room.size,
      imageUrls: room.imageUrls,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}

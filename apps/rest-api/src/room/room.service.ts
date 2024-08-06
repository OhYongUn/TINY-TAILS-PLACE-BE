// room.service.ts
import { Injectable } from '@nestjs/common';
import { AvailableRoomsDto } from './dto/available-rooms.dto';
import { RoomDto } from './dto/room.dto';
import { PrismaService } from '@app/common/prisma/prisma.service';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService) {}

  async findAvailableRooms(params: AvailableRoomsDto): Promise<RoomDto[]> {
    const { checkInDate, checkOutDate, petNum } = params;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const availableRooms = await this.prisma.room.findMany({
      where: {
        capacity: {
          gte: petNum,
        },
        availabilities: {
          every: {
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
        description: true,
        capacity: true,
        basePrice: true,
        size: true,
        imageUrls: true,
        availabilities: {
          where: {
            date: {
              gte: checkIn,
              lt: checkOut,
            },
          },
          select: {
            date: true,
            availableCount: true,
          },
        },
      },
    });

    return availableRooms.map((room) => ({
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
    }));
  }
}

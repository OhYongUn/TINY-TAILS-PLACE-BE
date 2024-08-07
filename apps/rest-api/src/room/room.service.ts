import { Injectable } from '@nestjs/common';
import { AvailableRoomsDto } from './dto/available-rooms.dto';
import { RoomDto } from './dto/room.dto';
import { PrismaService } from '@app/common/prisma/prisma.service';

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
    console.log('checkIn', checkIn);
    console.log('checkOut', checkOut);
    console.log('dayCount', dayCount);

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

      console.log('Query result:', availableRooms);

      const filteredRooms = availableRooms.filter(
        (room) => room.availabilities.length === dayCount,
      );

      if (filteredRooms.length === 0) {
        console.log('No available rooms found');
        return [];
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
      console.error('Error in findAvailableRooms:', error);
      throw error;
    }
  }
}

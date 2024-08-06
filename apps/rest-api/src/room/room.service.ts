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
    const petNumInt = parseInt(petNum, 10);

    console.log('Query params:', { checkIn, checkOut, petNumInt });

    try {
      const availableRooms = await this.prisma.room.findMany({
        where: {
          capacity: {
            gte: petNumInt,
          },
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
            orderBy: {
              date: 'asc',
            },
          },
        },
        distinct: ['class'],
      });

      console.log('Query result:', availableRooms);

      if (!availableRooms || availableRooms.length === 0) {
        console.log('No available rooms found');
        return [];
      }

      return availableRooms.map(
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

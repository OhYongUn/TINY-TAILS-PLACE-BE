import { Injectable } from '@nestjs/common';
import { RoomStatus } from '@prisma/client';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { CreateRoomDetailDto } from '@apps/rest/room-detail/dto/create-room-detail.dto';
import { UpdateRoomDetailDto } from '@apps/rest/room-detail/dto/update-room-detail.dto';
import { RoomDetailSchema } from '@apps/rest/room-detail/dto/RoomDetailSchema';
@Injectable()
export class RoomDetailService {
  constructor(private prisma: PrismaService) {}

  create(createRoomDetailDto: CreateRoomDetailDto) {
    return this.prisma.roomDetail.create({
      data: createRoomDetailDto,
    });
  }

  async findAll(
    roomId?: number,
    status?: RoomStatus,
  ): Promise<RoomDetailSchema[]> {
    const where: any = {};
    if (roomId) where.roomId = roomId;
    if (status) where.status = status;

    return this.prisma.roomDetail.findMany({ where });
  }

  findOne(id: number) {
    return this.prisma.roomDetail.findUnique({
      where: { id },
    });
  }

  update(id: number, updateRoomDetailDto: UpdateRoomDetailDto) {
    return this.prisma.roomDetail.update({
      where: { id },
      data: updateRoomDetailDto,
    });
  }

  remove(id: number) {
    return this.prisma.roomDetail.delete({
      where: { id },
    });
  }
}

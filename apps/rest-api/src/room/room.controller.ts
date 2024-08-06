// room.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { AvailableRoomsDto } from './dto/available-rooms.dto';
import { RoomDto } from './dto/room.dto';

@ApiTags('rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('available')
  @ApiOperation({ summary: '사용 가능한 방 조회' })
  @ApiResponse({
    status: 200,
    description: '사용 가능한 방 목록',
    type: [RoomDto],
  })
  @ApiQuery({ name: 'checkInDate', required: true, type: Date })
  @ApiQuery({ name: 'checkOutDate', required: true, type: Date })
  @ApiQuery({ name: 'petNum', required: true, type: Number })
  async getAvailableRooms(
    @Query() query: AvailableRoomsDto,
  ): Promise<RoomDto[]> {
    return this.roomService.findAvailableRooms(query);
  }
}

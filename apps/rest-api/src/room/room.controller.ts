// room.controller.ts
import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { AvailableRoomsDto } from './dto/available-rooms.dto';
import { RoomDto } from './dto/room.dto';
import { RoomExceptionFilter } from '@apps/rest/room/exceptions/room-exception.filter';

@ApiTags('rooms')
@Controller('rooms')
@UseFilters(RoomExceptionFilter)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('available')
  @ApiOperation({ summary: '사용 가능한 방 조회' })
  @ApiResponse({
    status: 200,
    description: '사용 가능한 방 목록',
    type: RoomDto,
    isArray: true,
  })
  @ApiQuery({ name: 'checkInDate', required: true, type: Date })
  @ApiQuery({ name: 'checkOutDate', required: true, type: Date })
  async getAvailableRooms(
    @Query() query: AvailableRoomsDto,
  ): Promise<RoomDto[]> {
    return this.roomService.findAvailableRooms(query);
  }
}

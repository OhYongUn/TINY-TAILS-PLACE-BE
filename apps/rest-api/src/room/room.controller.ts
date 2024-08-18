// room.controller.ts
import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { SearchRoomsDto } from './dto/search-rooms.dto';
import { RoomExceptionFilter } from '@apps/rest/room/exceptions/room-exception.filter';
import { AvailableRoomClassDto } from '@apps/rest/room/dto/available-room-class.dto';
import { createSuccessResponse } from '@app/common/utils/api-response.util';

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
    type: AvailableRoomClassDto,
    isArray: true,
  })
  @ApiQuery({ name: 'checkInDate', required: true, type: String })
  @ApiQuery({ name: 'checkOutDate', required: true, type: String })
  async getAvailableRooms(@Query() query: SearchRoomsDto) {
    const result = await this.roomService.findAvailableRooms(query);
    return createSuccessResponse(result);
  }
}

/*@Post()
@ApiOperation({ summary: '새 객실 생성' })
@ApiResponse({
  status: 201,
  description: '객실이 성공적으로 생성됨',
  type: Room,
})
create(@Body() createRoomDto: CreateRoomDto) {
  return this.roomService.create(createRoomDto);
}

@Get()
@ApiOperation({ summary: '모든 객실 조회' })
@ApiResponse({
  status: 200,
  description: '객실 목록 반환',
  type: Room,
  isArray: true,
})
findAll(): Promise<Room[]> {
  return this.roomService.findAll();
}

@Get(':id')
@ApiOperation({ summary: '특정 객실 조회' })
@ApiParam({ name: 'id', description: '객실 ID' })
@ApiResponse({ status: 200, description: '객실 정보 반환', type: Room })
@ApiResponse({ status: 404, description: '객실을 찾을 수 없음' })
findOne(@Param('id') id: string) {
  return this.roomService.findOne(+id);
}

@Put(':id')
@ApiOperation({ summary: '객실 정보 수정' })
@ApiParam({ name: 'id', description: '객실 ID' })
@ApiResponse({
  status: 200,
  description: '객실 정보가 성공적으로 수정됨',
  type: Room,
})
@ApiResponse({ status: 404, description: '객실을 찾을 수 없음' })
update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  return this.roomService.update(Number(id), updateRoomDto);
}

@Delete(':id')
@ApiOperation({ summary: '객실 삭제' })
@ApiParam({ name: 'id', description: '객실 ID' })
@ApiResponse({ status: 200, description: '객실이 성공적으로 삭제됨' })
@ApiResponse({ status: 404, description: '객실을 찾을 수 없음' })
remove(@Param('id') id: string) {
  return this.roomService.remove(+id);
}*/

// room.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { SearchRoomsDto } from './dto/search-rooms.dto';
import { RoomExceptionFilter } from '@apps/rest/room/exceptions/room-exception.filter';
import { AvailableRoomClassDto } from '@apps/rest/room/dto/available-room-class.dto';
import { UpdateRoomDto } from '@apps/rest/room/dto/update-room.dto';
import { CreateRoomDto } from '@apps/rest/room/dto/create-room.dto';
import { Room } from '@apps/rest/room/dto/room.dto';
import { Type } from 'class-transformer';

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
  @ApiQuery({ name: 'checkInDate', required: true, type: Date })
  @ApiQuery({ name: 'checkOutDate', required: true, type: Date })
  async getAvailableRooms(
    @Query() query: SearchRoomsDto,
  ): Promise<AvailableRoomClassDto[]> {
    return this.roomService.findAvailableRooms(query);
  }

  @Post()
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
    type: Type<Room>(() => Room),
    isArray: true,
  })
  findAll() {
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
  }
}

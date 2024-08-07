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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { SearchRoomsDto } from './dto/search-rooms.dto';
import { RoomDto } from './dto/room.dto';
import { RoomExceptionFilter } from '@apps/rest/room/exceptions/room-exception.filter';
import { CreateRoomDto } from '@apps/rest/room/dto/create-room.dto';
import { UpdateRoomDto } from '@apps/rest/room/dto/ update-room.dto';
import { AvailableRoomDto } from '@apps/rest/room/dto/available-room.dto';
import { AvailableRoomClassDto } from '@apps/rest/room/dto/available-room-class.dto';

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
    type: AvailableRoomDto,
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
  @ApiOperation({ summary: '새 방 생성' })
  @ApiResponse({
    status: 201,
    description: '생성된 방 정보',
    type: RoomDto,
  })
  @ApiBody({ type: CreateRoomDto })
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<RoomDto> {
    return this.roomService.createRoom(createRoomDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 방 조회' })
  @ApiResponse({
    status: 200,
    description: '방 정보',
    type: RoomDto,
  })
  @ApiParam({ name: 'id', type: 'number' })
  async getRoom(@Param('id') id: number): Promise<RoomDto> {
    return this.roomService.getRoom(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '방 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '수정된 방 정보',
    type: RoomDto,
  })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateRoomDto })
  async updateRoom(
    @Param('id') id: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ): Promise<RoomDto> {
    return this.roomService.updateRoom(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '방 삭제' })
  @ApiResponse({
    status: 204,
    description: '방 삭제 완료',
  })
  @ApiParam({ name: 'id', type: 'number' })
  async deleteRoom(@Param('id') id: number): Promise<void> {
    return this.roomService.deleteRoom(id);
  }
}

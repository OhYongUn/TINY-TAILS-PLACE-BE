import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomDetailService } from './room-detail.service';
import { CreateRoomDetailDto } from '@apps/rest/room-detail/dto/create-room-detail.dto';
import { RoomStatus } from '@prisma/client';
import { UpdateRoomDetailDto } from '@apps/rest/room-detail/dto/update-room-detail.dto';
import { RoomDetailSchema } from '@apps/rest/room-detail/dto/RoomDetailSchema';
import { Type } from 'class-transformer';

@ApiTags('room-details')
@Controller('room-details')
export class RoomDetailController {
  constructor(private readonly roomDetailService: RoomDetailService) {}

  @Post()
  @ApiOperation({ summary: '새 객실 상세 정보 생성' })
  @ApiResponse({
    status: 201,
    description: '객실 상세 정보가 성공적으로 생성됨',
    type: RoomDetailSchema,
  })
  create(@Body() createRoomDetailDto: CreateRoomDetailDto) {
    return this.roomDetailService.create(createRoomDetailDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 객실 상세 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '객실 상세 정보 목록',
    type: Type<RoomDetailSchema>(() => RoomDetailSchema),
  })
  @ApiQuery({ name: 'roomId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: RoomStatus })
  findAll(
    @Query('roomId') roomId?: number,
    @Query('status') status?: RoomStatus,
  ) {
    return this.roomDetailService.findAll(roomId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 객실 상세 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '객실 상세 정보',
    type: RoomDetailSchema,
  })
  findOne(@Param('id') id: string) {
    return this.roomDetailService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '객실 상세 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '객실 상세 정보가 성공적으로 수정됨',
    type: RoomDetailSchema,
  })
  update(
    @Param('id') id: string,
    @Body() updateRoomDetailDto: UpdateRoomDetailDto,
  ) {
    return this.roomDetailService.update(Number(id), updateRoomDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '객실 상세 정보 삭제' })
  @ApiResponse({
    status: 200,
    description: '객실 상세 정보가 성공적으로 삭제됨',
  })
  remove(@Param('id') id: string) {
    return this.roomDetailService.remove(+id);
  }
}

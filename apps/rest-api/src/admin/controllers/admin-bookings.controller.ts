import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminBookingsService } from '@apps/rest/admin/services/admin-bookings.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomStatusResponseDto } from '@apps/rest/admin/dto/booking/room-status-response.dto';
import { ReservationDetailResponseDto } from '@apps/rest/admin/dto/reservation-detail-response.dto';
import { GetBookingsDto } from '@apps/rest/admin/dto/booking/get-bookings.dto';
import { BookingStatus } from '@prisma/client';
import { ReservationDetailType } from '@apps/rest/admin/types/type';
import { UpdateBookingStatusDto } from '@apps/rest/admin/dto/booking/update-booking-status.dto';

@ApiTags('admin-bookings')
@Controller('admin-bookings')
export class AdminBookingsController {
  constructor(private readonly adminBookingsService: AdminBookingsService) {}

  @Get()
  @ApiOperation({ summary: '예약 현황 리스트' })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiQuery({
    name: '검샙 옵션',
    required: false,
    enum: ['userName', 'roomNumber', 'phone'],
  })
  @ApiQuery({ name: 'searchQuery', required: false, type: String })
  @ApiQuery({
    name: '정렬 옵션',
    required: false,
    enum: ['checkInDate', 'checkOutDate', 'created_at'],
  })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getBookings(@Query() query: GetBookingsDto) {
    return await this.adminBookingsService.getBookings(query);
  }

  @Get('reservation-status')
  @ApiOperation({ summary: '특정 달의 객실 상태 확인' })
  @ApiResponse({
    status: 200,
    description: 'Room status retrieved successfully',
    type: RoomStatusResponseDto,
  })
  @ApiQuery({ name: 'year', required: true, type: Number })
  @ApiQuery({ name: 'month', required: true, type: Number })
  // @UseGuards(AdminAccessTokenGuard)
  async getReservations(
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<RoomStatusResponseDto> {
    return await this.adminBookingsService.getReservations(year, month);
  }

  @Get('reservation-detail/:bookingId')
  @ApiOperation({ summary: '상세 예약정보' })
  @ApiResponse({
    status: 200,
    description: '예약 세부정보가 성공적으로 검색되었습니다.',
    type: ReservationDetailResponseDto,
  })
  @ApiParam({ name: 'bookingId', required: true, type: String })
  @ApiQuery({
    name: 'types',
    required: false,
    isArray: true,
    enum: [
      'all',
      'bookingDetails',
      'statusHistories',
      'payments',
      'additionalFees',
      'user',
      'roomDetail',
    ],
    description:
      "검색할 정보 유형을 지정합니다. 모든 정보를 얻으려면 'all'을 사용하세요..",
  })
  async getReservationDetail(
    @Param('bookingId') bookingId: string,
    @Query('types') types?: Array<'all' | ReservationDetailType>,
  ): Promise<ReservationDetailResponseDto> {
    return await this.adminBookingsService.getReservationDetail(
      bookingId,
      types,
    );
  }

  @Patch(':bookingId/status')
  @ApiOperation({ summary: '예약 상태 업데이트' })
  @ApiResponse({
    status: 200,
    description: '예약 상태가 성공적으로 업데이트되었습니다.',
  })
  @ApiParam({ name: 'bookingId', required: true, type: String })
  @ApiBody({ type: UpdateBookingStatusDto })
  async updateBookingStatus(
    @Param('bookingId') bookingId: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ) {
    return this.adminBookingsService.updateBookingStatus(
      bookingId,
      updateStatusDto,
    );
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdminBookingsService } from '@apps/rest/admin/services/admin-bookings.service';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomStatusResponseDto } from '@apps/rest/admin/dto/booking/room-status-response.dto';
import { ReservationDetailResponseDto } from '@apps/rest/admin/dto/reservation-detail-response.dto';

@ApiTags('admin-bookings')
@Controller('admin-bookings')
export class AdminBookingsController {
  constructor(private readonly adminBookingsService: AdminBookingsService) {}

  @Get('reservation-status')
  @ApiOperation({ summary: 'Get room status for a specific month' })
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
    return this.adminBookingsService.getReservations(year, month);
  }

  @Get('reservation-detail/:bookingId')
  @ApiOperation({ summary: 'Get detailed reservation information' })
  @ApiResponse({
    status: 200,
    description: 'Reservation details retrieved successfully',
    type: ReservationDetailResponseDto,
  })
  @ApiParam({ name: 'bookingId', required: true, type: String })
  //@UseGuards(AdminAccessTokenGuard)
  async getReservationDetail(
    @Param('bookingId') bookingId: string,
  ): Promise<ReservationDetailResponseDto> {
    return this.adminBookingsService.getReservationDetail(bookingId);
  }
}

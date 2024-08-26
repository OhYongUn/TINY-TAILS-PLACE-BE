import { Controller, Get, Query } from '@nestjs/common';
import { AdminBookingsService } from '@apps/rest/admin/services/admin-bookings.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomStatusResponseDto } from '@apps/rest/admin/dto/booking/room-status-response.dto';

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
}

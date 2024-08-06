// booking.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ConfirmBookingDto } from '@apps/rest/booking/dto/confirm-booking.dto';
import { CancelBookingDto } from '@apps/rest/booking/dto/cancel-booking.dto';
import { PaymentService } from '@apps/rest/payment/payment.service';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('initiate')
  @ApiOperation({
    summary: '예약 초기화',
    description: '새로운 예약을 생성하고 초기화합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '예약이 성공적으로 초기화되었습니다.',
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  async initiateBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.initiateBooking(createBookingDto);
  }

  @Post('confirm')
  @ApiOperation({
    summary: '예약 확정',
    description: '예약을 확정하고 결제를 처리합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '예약이 성공적으로 확정되었습니다.',
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없습니다.' })
  async confirmBooking(@Body() confirmBookingDto: ConfirmBookingDto) {
    const { bookingId, paymentMethod } = confirmBookingDto;
    return this.paymentService.processPayment(bookingId, paymentMethod);
  }

  @Post('cancel')
  @ApiOperation({
    summary: '예약 취소',
    description: '기존 예약을 취소합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '예약이 성공적으로 취소되었습니다.',
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없습니다.' })
  async cancelBooking(@Body() cancelBookingDto: CancelBookingDto) {
    return this.bookingService.cancelBooking(cancelBookingDto);
  }
}

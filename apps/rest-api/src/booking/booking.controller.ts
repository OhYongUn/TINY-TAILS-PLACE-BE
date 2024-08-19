// booking.controller.ts
import {Body, Controller, Get, Param, Post, Query, UseFilters, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { InitiateBookingResponseDto } from '@apps/rest/booking/dto/Initiate-booking-response.dto';
import { CreateBookingDto } from '@apps/rest/booking/dto/create-booking.dto';
import { BookingExceptionFilter } from '@apps/rest/booking/exceptions/booking-exception.filter';
import { createSuccessResponse } from '@app/common/utils/api-response.util';
import { ConfirmPaymentDto } from '@apps/rest/payment/dto/confirm-payment.dto';
import {BookingQueryDto} from "@apps/rest/booking/dto/booking-query.dto";

@ApiTags('Booking')
@Controller('bookings')
@UseFilters(BookingExceptionFilter)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}


  @Get('detail/:bookingId')
  @ApiOperation({ summary: '예약 상세 정보 조회' })
  @ApiParam({ name: 'bookingId', type: 'string', description: 'Booking ID (UUID)' })
  @ApiResponse({ status: 200, description: '예약 상세 정보 조회 성공' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없음' })
  async getBookingDetail(@Param('bookingId') bookingId: string) {
    const booking = await this.bookingService.getBookingDetail(bookingId);

    return createSuccessResponse({ booking }, 200);
  }
  @Get(':userId')
  @ApiOperation({ summary: '사용자에 대한 예약 조회' })
  @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
  async getBookings(
      @Param('userId') userId: number,
      @Query() query: BookingQueryDto
  ) {

    const result = await this.bookingService.getBookings(userId, query);
    return createSuccessResponse(
        {
          bookings: result
        },
        200
    );
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: '예약 초기화 및 결제 준비 성공',
    type: InitiateBookingResponseDto,
  })
  async initiateBooking(@Body() createBookingDto: CreateBookingDto) {
    const result =
      await this.bookingService.createBookingAndInitiatePayment(
        createBookingDto,
      );
    return createSuccessResponse(
      {
        bookingId: result.booking.id,
        paymentId: result.payment.id,
        amount: result.booking.basePrice,
      },
      201,
    );
  }

  @Post('confirm')
  @ApiOperation({ summary: '결제 확인 및 예약 완료' })
  @ApiResponse({ status: 200, description: '결제 확인 성공' })
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    const result = await this.bookingService.confirmPayment(confirmPaymentDto); // await 추가
    return createSuccessResponse(
      {
        bookingId: result.booking.id,
        paymentId: result.payment.id,
      },
      201,
    );
  }
}

/* @Post('complete')
@ApiOperation({ summary: '결제 완료 및 예약 확정' })
@ApiResponse({
  status: 200,
  description: '예약 확정 성공',
  type: CompleteBookingResponseDto,
})
async completeBooking(@Body() completeBookingDto: CompleteBookingDto) {
  return this.bookingService.completeBooking(completeBookingDto);
}*/

// @Get(':bookingNum')
// @ApiOperation({ summary: '예약 조회' })
// @ApiResponse({ status: 200, description: '예약 조회 성공', type: BookingDto })
// async getBooking(@Param('bookingNum') bookingNum: string) {
//   return this.bookingService.getBookingByNum(bookingNum);
// }
//
// @Post('initiate')
// @ApiOperation({
//   summary: '예약 초기화',
//   description: '새로운 예약을 생성하고 초기화합니다.',
// })
// @ApiResponse({
//   status: 201,
//   description: '예약이 성공적으로 초기화되었습니다.',
// })
// @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
// async initiateBooking(@Body() createBookingDto: CreateBookingDto) {
//   return this.bookingService.initiateBooking(createBookingDto);
// }
//
// @Post('confirm')
// @ApiOperation({
//   summary: '예약 확정',
//   description: '예약을 확정하고 결제를 처리합니다.',
// })
// @ApiResponse({
//   status: 200,
//   description: '예약이 성공적으로 확정되었습니다.',
// })
// @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
// @ApiResponse({ status: 404, description: '예약을 찾을 수 없습니다.' })
// async confirmBooking(@Body() confirmBookingDto: ConfirmBookingDto) {
//   const { bookingId, paymentMethod } = confirmBookingDto;
//   return this.paymentService.processPayment(bookingId, paymentMethod);
// }
//
// @Post('cancel')
// @ApiOperation({
//   summary: '예약 취소',
//   description: '기존 예약을 취소합니다.',
// })
// @ApiResponse({
//   status: 200,
//   description: '예약이 성공적으로 취소되었습니다.',
// })
// @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
// @ApiResponse({ status: 404, description: '예약을 찾을 수 없습니다.' })
// async cancelBooking(@Body() cancelBookingDto: CancelBookingDto) {
//   return this.bookingService.cancelBooking(cancelBookingDto);
// }

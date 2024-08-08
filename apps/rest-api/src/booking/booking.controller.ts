// booking.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { PaymentService } from '@apps/rest/payment/payment.service';
import { InitiateBookingResponseDto } from '@apps/rest/booking/dto/Initiate-booking-response.dto';
import { CreateBookingDto } from '@apps/rest/booking/dto/create-booking.dto';
import { CompleteBookingDto } from '@apps/rest/booking/dto/complete-booking,dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  @ApiOperation({ summary: '예약 초기화 및 결제 준비' })
  @ApiResponse({
    status: 201,
    description: '예약 초기화 성공',
    type: InitiateBookingResponseDto,
  })
  async initiateBooking(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<InitiateBookingResponseDto> {
    const result =
      await this.bookingService.createBookingAndInitiatePayment(
        createBookingDto,
      );
    return {
      bookingNum: result.booking.bookingNum,
      paymentId: result.payment.id,
      totalAmount: result.booking.totalPrice,
      // 결제 게이트웨이에 필요한 추가 정보가 있다면 여기에 추가
    };
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
}

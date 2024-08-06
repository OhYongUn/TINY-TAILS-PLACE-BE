// booking.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaymentService } from '@apps/rest/payments/payments.service';
import { ConfirmBookingDto } from '@apps/rest/booking/dto/confirm-booking.dto';
import { CancelBookingDto } from '@apps/rest/booking/dto/cancel-booking.dto';

// booking.controller.ts
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('initiate')
  async initiateBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.initiateBooking(createBookingDto);
  }

  @Post('confirm')
  async confirmBooking(@Body() confirmBookingDto: ConfirmBookingDto) {
    const { bookingId, paymentMethod } = confirmBookingDto;
    return this.paymentService.processPayment(bookingId, paymentMethod);
  }
  @Post('cancel')
  async cancelBooking(@Body() cancelBookingDto: CancelBookingDto) {
    return this.bookingService.cancelBooking(cancelBookingDto);
  }
}

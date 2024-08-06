import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaModule } from '@app/common/prisma/prisma.module';
import { PaymentModule } from '@apps/rest/payment/payment.module';

@Module({
  imports: [PrismaModule, PaymentModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}

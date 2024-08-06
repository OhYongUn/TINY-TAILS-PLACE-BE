import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/common/prisma/prisma.module';
import { PaymentController } from '@apps/rest/payment/payment.controller';
import { PaymentService } from '@apps/rest/payment/payment.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

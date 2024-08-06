import { Controller } from '@nestjs/common';
import { PaymentService } from '@apps/rest/payment/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentsService: PaymentService) {}
}

import {Module} from '@nestjs/common';
import {PaymentController} from '@apps/rest/payment/payment.controller';
import {PaymentService} from '@apps/rest/payment/payment.service';

@Module({
    imports: [],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {
}

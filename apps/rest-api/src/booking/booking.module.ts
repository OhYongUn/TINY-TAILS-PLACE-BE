import {Module} from '@nestjs/common';
import {BookingService} from './booking.service';
import {BookingController} from './booking.controller';
import {PaymentModule} from '@apps/rest/payment/payment.module';

@Module({
    imports: [PaymentModule],
    providers: [BookingService],
    controllers: [BookingController],
})
export class BookingModule {
}

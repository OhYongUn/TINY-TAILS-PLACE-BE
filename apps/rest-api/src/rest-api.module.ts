import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common/common.module';
import { UsersModule } from './users/users.module';
import { BookingModule } from './booking/booking.module';
import { RoomModule } from './room/room.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from '@apps/rest/payment/payment.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    BookingModule,
    RoomModule,
    ProductsModule,
    OrdersModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class RestApiModule {}

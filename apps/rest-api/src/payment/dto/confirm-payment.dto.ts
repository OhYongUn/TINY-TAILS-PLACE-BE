import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmPaymentDto {
  @ApiProperty({ description: '결제 ID' })
  @IsString()
  paymentId: string;

  @ApiProperty({ description: '예약 번호' })
  @IsString()
  bookingId: string;

  @ApiProperty({ description: '결제 금액' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: '결제 게이트웨이 트랜잭션 ID' })
  @IsString()
  transactionId: string;
}

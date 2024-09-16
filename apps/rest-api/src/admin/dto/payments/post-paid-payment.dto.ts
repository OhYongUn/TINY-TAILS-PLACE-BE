import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PostPaidPaymentDto {
  @ApiProperty({
    description: '결제 ID',
    example: 'payment_uuid_here',
  })
  @IsString()
  paymentId: string;

  @ApiProperty({
    description: '결제 금액',
    example: 100000,
  })
  @IsNumber()
  amount: number;
}

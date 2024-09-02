import { Body, Controller, Patch } from '@nestjs/common';
import { AdminPaymentsService } from '@apps/rest/admin/services/admin-payments.service';
import { PostPaidPaymentDto } from '@apps/rest/admin/dto/payments/post-paid-payment.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('admin-payments')
export class AdminPaymentsController {
  constructor(private readonly adminPaymentsService: AdminPaymentsService) {}

  @Patch('payment/paid')
  @ApiOperation({
    summary: '후불 결제 처리',
    description: '지정된 결제 ID에 대해 후불 결제를 처리합니다.',
  })
  @ApiBody({ type: PostPaidPaymentDto })
  @ApiResponse({
    status: 200,
    description: '후불 결제가 성공적으로 처리되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '지정된 ID의 결제를 찾을 수 없습니다.',
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 데이터' })
  async processPostPaidPayment(@Body() postPaidPaymentDto: PostPaidPaymentDto) {
    console.log('postPaidPaymentDto', postPaidPaymentDto);
    return this.adminPaymentsService.processPostPaidPayment(postPaidPaymentDto);
  }
}

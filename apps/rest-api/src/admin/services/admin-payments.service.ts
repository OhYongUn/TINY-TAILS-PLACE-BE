import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { PostPaidPaymentDto } from '@apps/rest/admin/dto/payments/post-paid-payment.dto';

@Injectable()
export class AdminPaymentsService {
  private readonly logger = new Logger(AdminPaymentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async processPostPaidPayment(postPaidPaymentDto: PostPaidPaymentDto) {
    const { paymentId, amount } = postPaidPaymentDto;

    try {
      const updatedPayment = await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          amount,
          status: PaymentStatus.COMPLETED,
          method: PaymentMethod.CREDIT_CARD, // 기본값으로 설정, 필요에 따라 변경 가능
        },
      });

      this.logger.log(`Post-paid payment ${paymentId} processed successfully`);
      return {
        success: true,
        message: '후불 결제가 성공적으로 처리되었습니다.',
        data: { updatedPayment },
      };
    } catch (error) {
      this.logger.error(
        `Failed to process post-paid payment ${paymentId}:`,
        error.message,
      );
      if (error.code === 'P2025') {
        throw new NotFoundException(`Payment with ID ${paymentId} not found`);
      }
      throw error;
    }
  }
}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from '@app/common/prisma/prisma.service';

@Module({
  providers: [UserService, PrismaService], // PrismaService를 providers 배열에 추가
  exports: [UserService], // UserService를 외부에서 사용할 수 있도록 exports에 추가
})
export class UserModule {}

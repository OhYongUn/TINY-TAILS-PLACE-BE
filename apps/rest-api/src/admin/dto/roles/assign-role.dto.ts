import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ description: 'The ID of the admin' })
  @IsString()
  adminId: string;

  @ApiProperty({ description: 'The ID of the role' })
  @IsNumber()
  roleId: number;
}

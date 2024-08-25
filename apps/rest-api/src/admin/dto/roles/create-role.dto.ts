import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'The name of the role' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the role', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The IDs of the permissions to assign to this role',
    required: false,
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  permissionIds?: number[];
}

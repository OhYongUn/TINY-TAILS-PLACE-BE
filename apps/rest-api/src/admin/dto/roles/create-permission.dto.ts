import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'The name of the permission' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the permission',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The resource this permission applies to' })
  @IsString()
  resource: string;

  @ApiProperty({ description: 'The action this permission allows' })
  @IsString()
  action: string;
}

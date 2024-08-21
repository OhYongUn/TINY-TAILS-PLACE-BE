import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminSearchDto {
    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive?: boolean;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(['name', 'email', 'createdAt'])
    sortBy?: 'name' | 'email' | 'createdAt' = 'createdAt';

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}

export class AdminResponseDto {
    id: string;
    name: string;
    email: string;
    department?: string;
    isActive: boolean;
    createdAt: Date;
    roles: string[];
}

export class PaginatedAdminResponseDto {
    data: AdminResponseDto[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
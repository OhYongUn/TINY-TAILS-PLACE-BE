import { IsOptional, IsEnum, IsString, IsInt, Min, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BookingStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class BookingQueryDto {
    @ApiProperty({ required: false, description: 'Page number', default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @ApiProperty({ required: false, description: 'Number of items per page', default: 10 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    pageSize?: number = 10;

    @ApiProperty({ required: false, description: 'Booking status', enum: BookingStatus, isArray: true })
    @IsOptional()
    @IsEnum(BookingStatus, { each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
    status?: BookingStatus[];

    @ApiProperty({ required: false, description: 'Start date for filtering' })
    @IsOptional()
    @IsString()
    dateFrom?: string;

    @ApiProperty({ required: false, description: 'End date for filtering' })
    @IsOptional()
    @IsString()
    dateTo?: string;

    @ApiProperty({ required: false, description: 'Type of date to filter by', enum: ['checkIn', 'checkOut'], default: 'checkOut' })
    @IsOptional()
    @IsEnum(['checkIn', 'checkOut'])
    dateType?: 'checkIn' | 'checkOut' = 'checkOut';

    @ApiProperty({ required: false, description: 'Field to order by', enum: ['checkInDate', 'checkOutDate', 'createdAt'] })
    @IsOptional()
    @IsEnum(['checkInDate', 'checkOutDate', 'createdAt'])
    orderBy?: 'checkInDate' | 'checkOutDate' | 'createdAt';

    @ApiProperty({ required: false, description: 'Order direction', enum: ['asc', 'desc'], default: 'desc' })
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    order?: 'asc' | 'desc' = 'desc';
}
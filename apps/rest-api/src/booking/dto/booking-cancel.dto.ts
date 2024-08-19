// cancel-booking.dto.ts
import {IsInt, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
    @ApiProperty({
        description: '취소할 예약의 ID',
    })
    @IsString()
    bookingId: string;

    @ApiProperty({
        description: '취소 사유',
    })
    @IsString()
    reason: string;

}

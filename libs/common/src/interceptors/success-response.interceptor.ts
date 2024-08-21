// common/src/interceptors/success-response.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CustomResponse<T> {
    data: T;
    message?: string;
    statusCode?: number;
}

export interface SuccessResponse<T> {
    success: boolean;
    statusCode: number;
    data: T;
    message?: string;
    error: null;
}

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
        return next.handle().pipe(
            map(response => {
                const statusCode = context.switchToHttp().getResponse().statusCode;

                if (response && typeof response === 'object' && 'data' in response) {
                    const customResponse = response as CustomResponse<T>;
                    return {
                        success: true,
                        statusCode: customResponse.statusCode || statusCode,
                        data: customResponse.data,
                        message: customResponse.message,
                        error: null,
                    };
                }

                return {
                    success: true,
                    statusCode,
                    data: response,
                    error: null,
                };
            }),
        );
    }
}
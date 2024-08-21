export class ErrorCode {
    constructor(
        public code: string,
        public statusCode: number,
        public message: string,
    ) {}
}
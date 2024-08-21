export class AppException extends Error {
    constructor(
        public readonly code: string,
        public readonly statusCode: number,
        message: string
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}
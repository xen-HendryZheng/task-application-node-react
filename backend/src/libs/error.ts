export class StandardError extends Error {
    public error_code: string;

    public lastError?: Record<string, unknown> | null;

    public context?: Record<string, unknown> | null;

    constructor(
        errorCode: string,
        message?: string,
        lastError?: Record<string, unknown> | null,
        context?: Record<string, unknown> | null
    ) {

        const msg = message || ErrorMessage[errorCode];
        super(msg);

        // So you can do typeof CustomError
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
        this.error_code = errorCode;
        this.lastError = lastError;
        this.context = context;
    }
}

export const ErrorCodes = {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    EMAIL_ALREADY_EXIST: 'EMAIL_ALREADY_EXIST',
    TASK_NOT_FOUND: 'TASK_NOT_FOUND',
};
export const ErrorMessage: { [key: string]: string } = {
    INVALID_CREDENTIALS: 'You have entered invalid credentials',
    USER_NOT_FOUND: 'User id not found',
    EMAIL_ALREADY_EXIST: 'EMAIL_ALREADY_EXIST',
    TASK_NOT_FOUND: 'TASK_NOT_FOUND'
}
export const ErrorCodeMap: { [key: string]: number } = {
    INVALID_CREDENTIALS: 401,
    USER_NOT_FOUND: 404,
    EMAIL_ALREADY_EXIST: 400,
    TASK_NOT_FOUND: 404
};

export const ErrorCodeTypeorm: { [key: number]: string } = {
    23505: 'EMAIL_ALREADY_EXIST'
}
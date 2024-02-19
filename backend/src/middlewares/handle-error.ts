import { Request, NextFunction, Response } from 'express';
import { ValidationError } from 'express-openapi-validator/dist/framework/types';
import { ErrorCodeMap } from '../libs/error';

export const errorHandler = () => {
    return (err: any, req: Request, res: Response, next: NextFunction) => {
        if ((err as ValidationError).status) {
            console.log({ err }, 'Validation Error');
            return res.status(err.status).json({
                message: err.message,
                error_code: err.error_code,
                // only exposed Xendit-API-standard compliant fields //
                errors: err.errors
                    ? err.errors.map((e: { path: string; message: string; doc_url?: string }) => ({
                        path: e.path, // eslint-disable-line
                        message: e.message, // eslint-disable-line @typescript-eslint/indent
                        doc_url: e.doc_url, // eslint-disable-line @typescript-eslint/indent
                    })) // eslint-disable-line @typescript-eslint/indent
                    : err.errors,
            });
        }
        console.log({ err }, 'OTHER Error');
        const statusCode = Number(ErrorCodeMap[err.error_code]);
        if (!Number.isNaN(statusCode)) {
            const logContext = {
                error_code: err.error_code,
                status_code: statusCode,
                context: err.context,
            };
            return res.status(statusCode).json({
                error_code: err.error_code,
                message: err.message,
            });
        }

        return res.status(500).json({
            error_code: 'SERVER_ERROR',
            message: 'Something unexpected happened, we are investigating this issue right now',
        });
    }
};
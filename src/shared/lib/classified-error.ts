"server-only";

import { AppError } from "./app-error";

export type ClassifiedError = {
    message: string;
    statusCode: number;
};

export function mapAppError(err: AppError): ClassifiedError {
    return {
        message: err.message,
        statusCode: err.statusCode,
    };
}

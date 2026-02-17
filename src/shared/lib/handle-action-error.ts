"server-only";
import { ActionResponse } from "./action-response";
import { mapAppError } from "./classified-error";
import { mapPrismaError } from "./prisma-errors";
import { AppError } from "./app-error";
import { mapAuthErrors } from "./auth-errors";
import { isZodError, isBetterAuthError } from "./error-utils";
import {
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/client";

export function handleActionError(err: unknown): ActionResponse<void> {
    console.error("Action error:", err);

    let errorStatus: { message: string; statusCode: number };

    if (err instanceof AppError) {
        errorStatus = mapAppError(err);
    } else if (
        err instanceof PrismaClientUnknownRequestError ||
        err instanceof PrismaClientValidationError
    ) {
        errorStatus = mapPrismaError(err);
    } else if (isZodError(err)) {
        errorStatus = {
            message: "Validation failed",
            statusCode: 400,
        };
    } else if (isBetterAuthError(err)) {
        errorStatus = mapAuthErrors(err);
    } else {
        errorStatus = {
            message: "Something went wrong",
            statusCode: 500,
        };
    }

    return {
        type: "ERROR",
        message: errorStatus.message,
        statusCode: errorStatus.statusCode,
    };
}

"server-only";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import { ClassifiedError } from "./classified-error";

export function mapPrismaError(
    err: PrismaClientKnownRequestError | PrismaClientValidationError,
): ClassifiedError {
    if (err instanceof PrismaClientValidationError) {
        return {
            message: "Invalid data",
            statusCode: 400,
        };
    }

    switch (err.code) {
        case "P2002":
            return { message: "Duplicate entry", statusCode: 409 };
        case "P2025":
            return { message: "Not found", statusCode: 404 };
        case "P2003":
            return {
                message: "This item is linked to other records",
                statusCode: 400,
            };
        default:
            return { message: "Something went wrong", statusCode: 500 };
    }
}

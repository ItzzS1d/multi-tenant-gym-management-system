"server-only";
import { APIError } from "better-auth";
import { ClassifiedError } from "./classified-error";

export function mapAuthErrors(err: APIError): ClassifiedError {
    switch (err.status) {
        case "UNAUTHORIZED":
            return { message: "Invalid email or password ", statusCode: 401 };
        case "FORBIDDEN":
            return { message: err.message, statusCode: 403 };
        case "NOT_FOUND":
            return { message: "Not found", statusCode: 404 };
        case "UNPROCESSABLE_ENTITY":
            return { message: err.message, statusCode: 422 };
        case "BAD_REQUEST":
            return { message: err.message, statusCode: 400 };

        default:
            return { message: "Something went wrong", statusCode: 500 };
    }
}

"server-only";
import { AppError } from "./app-error";

export class ValidationError extends AppError {
    constructor(message = "Invalid data") {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not found") {
        super(message, 404);
    }
}

export class UserNotFoundError extends UnauthorizedError {
    constructor(message: string = "Unauthorized") {
        super(message);
    }
}

export class AlreadyExistsError extends AppError {
    constructor(message: string = "Already exists") {
        super(message, 400);
    }
}

export class SomethingWentWrongError extends AppError {
    constructor(message: string = "Something went wrong") {
        super(message, 500);
    }
}

export class NoOrganizationError extends ForbiddenError {
    constructor(message: string = "No organization context") {
        super(message);
    }
}

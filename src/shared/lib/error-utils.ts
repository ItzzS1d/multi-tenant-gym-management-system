"server-only";
import { APIError } from "better-auth";
import { ZodError } from "zod";

export function isZodError(err: unknown): err is ZodError {
    return err instanceof ZodError;
}
export function isBetterAuthError(err: unknown): err is APIError {
    return err instanceof APIError;
}

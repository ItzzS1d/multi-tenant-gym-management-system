"use server";
import { ActionResponse } from "@/shared/lib/action-response";
import {
    loginSchema,
    LoginSchema,
    registerSchema,
    RegisterSchema,
} from "./validations/client-validation";
import { ValidationError } from "@/shared/lib/error-classes";
import { auth } from "@/shared/config/auth.config";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { headers } from "next/headers";
import prisma from "@/shared/config/prisma.config";
import { redirect } from "next/navigation";
import { RedirectType } from "next/navigation";
import { Route } from "next";
import { createAuthLog } from "@/shared/lib/server-utils";

export const registerAction = async (
    values: RegisterSchema,
): Promise<ActionResponse<void>> => {
    const parsed = registerSchema.safeParse(values);
    try {
        if (!parsed.success) throw new ValidationError("Invalid form data");
        const { email, password, firstName, lastName, phone } = parsed.data;

        const { user } = await auth.api.signUpEmail({
            body: {
                email,
                password,
                callbackURL: `/dashboard`,
                name: `${firstName} ${lastName}`,
                phone,
            },
        });
        if (user) {
            createAuthLog({
                emailUsed: user.email,
                event: "REGISTER_SUCCESS",
                userId: user.id,
            });
        }
        return {
            type: "SUCCESS",
            message: "Please Check Your Email for Verification",
        };
    } catch (err: unknown) {
        createAuthLog({
            emailUsed: values.email,
            event: "REGISTER_FAIL",
            failureReason: (err as Error).message,
        });
        return handleActionError(err);
    }
};

export const loginAction = async ({
    values,
    redirectTo,
}: {
    values: LoginSchema;
    redirectTo: Route;
}): Promise<ActionResponse<{ onboardingCompleted: boolean } | void>> => {
    const { success, data } = loginSchema.safeParse(values);
    const headersList = await headers();

    let ip = headersList.get("x-forwarded-for") || "Unknown";
    const userAgent = headersList.get("user-agent") || "Unknown";

    if (ip === "::1") {
        ip = "127.0.0.1";
    }
    try {
        if (!success) throw new ValidationError("Invalid form data");

        const { email, password } = data;

        const { user } = await auth.api.signInEmail({
            body: {
                email,
                password,
                callbackURL: "/",
            },
        });

        if (!user) {
            throw new ValidationError("Invalid email or password");
        }

        createAuthLog({
            emailUsed: user.email,
            event: "LOGIN_SUCCESS",
            userId: user.id,
        });
    } catch (error) {
        createAuthLog({
            emailUsed: values.email,
            event: "LOGIN_FAIL",
            failureReason: (error as Error).message,
        });
        return handleActionError(error);
    }
    redirect(redirectTo, RedirectType.replace);
};
export const tenantLoginAction = async ({
    values,
    redirectTo,
}: {
    values: LoginSchema;
    redirectTo: Route;
}): Promise<ActionResponse<void>> => {
    const { success, data } = loginSchema.safeParse(values);

    const headersList = await headers();

    let ip = headersList.get("x-forwarded-for") || "Unknown";
    const userAgent = headersList.get("user-agent") || "Unknown";
    if (ip === "::1") ip = "127.0.0.1";
    let gymId;
    try {
        if (!success) throw new ValidationError("Invalid form data");

        const { email, password } = data;

        const host = headersList.get("host") || "";
        const subdomain = host.split(".")[0].replace(/:3000$/, "");

        const gym = await prisma.gym.findUnique({
            where: { slug: subdomain },
            select: { id: true },
        });

        if (!gym) throw new ValidationError("Invalid email or password");
        gymId = gym.id;

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                gymMemberships: {
                    where: {
                        gymId: gym.id,
                        isActive: true,
                    },
                    select: {
                        isActive: true,
                        gymId: true,
                    },
                },
            },
        });

        if (!user || user.gymMemberships.length === 0)
            throw new ValidationError("Invalid email or password");

        const { user: sessionUser } = await auth.api.signInEmail({
            body: {
                email,
                password,
                callbackURL: "/",
            },
        });

        if (!sessionUser) {
            throw new ValidationError("Invalid email or password");
        }

        createAuthLog({
            emailUsed: values.email,
            event: "LOGIN_SUCCESS",
            userId: sessionUser.id,
            gymId,
        });
    } catch (error) {
        createAuthLog({
            emailUsed: values.email,
            event: "LOGIN_FAIL",
            failureReason: (error as Error).message,
            gymId,
        });
        return handleActionError(error);
    }

    redirect(redirectTo, RedirectType.replace);
};

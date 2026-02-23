"use server";

import { ActionResponse } from "@/shared/lib/action-response";
import { onboardingSchema, OnboardingSchema } from "./validations";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { requireUser } from "@/shared/lib/session";
import { redirect } from "next/navigation";
import { setCookie } from "@/shared/lib/cookie-util";
import { RedirectType } from "next/navigation";
import { auth } from "@/shared/config/auth.config";
import {
    AlreadyExistsError,
    ValidationError,
} from "@/shared/lib/error-classes";
import prisma from "@/shared/config/prisma.config";
import {
    constructUrl,
    createAuditLog,
    getAuditMetadata,
} from "@/shared/lib/server-utils";

export async function completeOnboardingAction(
    formData: OnboardingSchema,
): Promise<ActionResponse<void>> {
    const { data, success } = onboardingSchema.safeParse(formData);

    try {
        if (!success) throw new ValidationError();
        const { user } = await requireUser();

        const { status } = await auth.api.checkOrganizationSlug({
            body: {
                slug: data?.subDomain,
            },
        });

        if (!status) throw new AlreadyExistsError("Subdomain already taken");

        if (!user.emailVerified) {
            throw new ValidationError(
                "Email not verified, please verify your email",
            );
        }
        if (user.hasCompletedOnboarding) {
            throw new AlreadyExistsError("You already have a gym set up");
        }

        await prisma.$transaction(async (tx) => {
            const newGym = await tx.gym.create({
                data: {
                    name: data.gymName,
                    closingTime: data.closingTime || "",
                    openingTime: data.openingTime || "",
                    address: data.gymAddress,
                    slug: data.subDomain,
                },
            });
            const newMember = await tx.gymMember.create({
                data: {
                    gymId: newGym.id,
                    userId: user.id,
                    role: "owner",
                },
            });
            await tx.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    hasCompletedOnboarding: true,
                },
            });
            const recentSession = await tx.session.findFirst({
                where: {
                    userId: user.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            if (recentSession) {
                await tx.session.update({
                    where: {
                        id: recentSession.id,
                    },
                    data: {
                        activeOrganizationId: newGym.id,
                    },
                });
            }
            const metadata = await getAuditMetadata();
            await createAuditLog(
                {
                    action: "CREATE",
                    entity: "STAFF",
                    entityId: newGym.id,
                    actor: {
                        connect: {
                            id: newMember.id,
                        },
                    },
                    actorEmail: user.email,
                    actorName: user.name,
                    gym: {
                        connect: {
                            id: newGym.id,
                        },
                    },
                    status: "SUCCESS",
                    changes: "none",
                    sessionId: recentSession?.id,
                },
                tx,
                metadata,
            );
        });

        await setCookie({
            message: "Your onboarding completed successfully",
            type: "success",
        });
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }

    const url = constructUrl("/members", data.subDomain);
    redirect(url, RedirectType.replace);
}

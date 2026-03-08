"use server";

import { ValidationError } from "@/shared/lib/error-classes";
import {
    createPlanSchema,
    CreatePlanSchema,
    togglePlanStatusSchema,
    TogglePlanStatusSchema,
    updatePlanSchema,
    UpdatePlanSchema,
} from "./plans-validations";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import prisma from "@/shared/config/prisma.config";
// getActivePlans action wrapper removed, use API route instead
import { createAuditLog, getAuditMetadata } from "@/shared/lib/server-utils";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { ActionResponse } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";

export const createPlan = async (
    formData: CreatePlanSchema,
): Promise<ActionResponse<void>> => {
    const { success, data } = createPlanSchema.safeParse(formData);

    try {
        if (!success) throw new ValidationError("Invalid data");

        const currentStaff = await requirePermissionAndReturnUser("plan", [
            "create",
        ]);
        const metadata = await getAuditMetadata();
        prisma.$transaction(async (tx) => {
            const plan = await tx.plan.create({
                data: {
                    name: data.name,
                    durationInDays: data.durationInDays * 30,
                    price: data.price,
                    gymId: currentStaff.organizationId,
                    isActive: data.isActive,
                    description: data.description,
                    createdById: currentStaff.id,
                },
            });

            await createAuditLog(
                {
                    action: "CREATE",
                    actorEmail: currentStaff.user.email,
                    actorName: currentStaff.user.name,
                    actor: {
                        connect: { id: currentStaff.id },
                    },
                    entity: "PLAN",
                    status: "SUCCESS",
                    entityId: plan.id,
                },
                tx,
                metadata,
            );
        });

        revalidatePath("/plans");

        return {
            type: "SUCCESS",
            message: "Plan created successfully",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

export const updatePlan = async (
    formData: UpdatePlanSchema,
): Promise<ActionResponse<void>> => {
    const { success, data } = updatePlanSchema.safeParse(formData);
    try {
        if (!success) {
            throw new ValidationError("Invalid data");
        }

        const currentStaff = await requirePermissionAndReturnUser("plan", [
            "update",
        ]);
        const metadata = await getAuditMetadata();
        await prisma.$transaction([
            prisma.plan.update({
                where: {
                    id: data.id,
                },
                data: {
                    name: data.name,
                    durationInDays: data.durationInDays
                        ? data.durationInDays * 30
                        : undefined,
                    price: data.price,
                    description: data.description,
                    isActive: data.isActive,
                    updatedById: currentStaff.id,
                },
            }),

            createAuditLog(
                {
                    action: "UPDATE",
                    actorEmail: currentStaff.user?.email || "Unknown",
                    actorName: currentStaff.user.name || "Unknown",
                    actor: {
                        connect: {
                            id: currentStaff.id,
                        },
                    },
                    entity: "PLAN",
                    status: "SUCCESS",
                    entityId: data.id,
                },
                prisma,
                metadata,
            ),
        ]);

        revalidatePath("/plans");
        return {
            type: "SUCCESS",
            message: "Plan updated successfully",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};
export const togglePlanStatus = async (
    formData: TogglePlanStatusSchema,
): Promise<ActionResponse<void>> => {
    try {
        const { success, data } = togglePlanStatusSchema.safeParse(formData);
        if (!success) {
            throw new ValidationError("Invalid data");
        }
        const currentStaff = await requirePermissionAndReturnUser("plan", [
            "update",
        ]);
        const metadata = await getAuditMetadata();
        await prisma.$transaction([
            prisma.plan.update({
                where: {
                    id: data.id,
                },
                data: {
                    isActive: data.isActive,
                    updatedById: currentStaff.id,
                    updatedAt: new Date(),
                },
            }),

            createAuditLog(
                {
                    action: "UPDATE",
                    actorEmail: currentStaff.user.email,
                    actorName: currentStaff.user.name,
                    actor: {
                        connect: {
                            id: currentStaff.id,
                        },
                    },
                    entity: "PLAN",
                    status: "SUCCESS",
                    entityId: data.id,
                    changes: {
                        before: {
                            isActive: data.isActive,
                        },
                        after: {
                            isActive: !data.isActive,
                        },
                    },
                },
                prisma,
                metadata,
            ),
        ]);
        revalidatePath("/plans");
        return {
            type: "SUCCESS",
            message: `Plan ${data.isActive ? "activated" : "deactivated"} successfully`,
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

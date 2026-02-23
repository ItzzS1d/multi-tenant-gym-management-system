"use server";

import prisma from "@/shared/config/prisma.config";
import { ActionResponse } from "@/shared/lib/action-response";
import { ValidationError } from "@/shared/lib/error-classes";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import {
    disableStaffAccountSchema,
    DisableStaffAccountSchema,
} from "./staff-schema";

export const disableStaffAccount = async (
    formData: DisableStaffAccountSchema,
): Promise<ActionResponse<void>> => {
    try {
        const { success, data } = disableStaffAccountSchema.safeParse(formData);
        if (!success) {
            throw new ValidationError("Invalid input data");
        }
        // check if the current user has permission to disable accounts
        const currentStaff = await requirePermissionAndReturnUser("staff", [
            "update",
        ]);

        //  update the user's account to be disabled
        await prisma.gymMember.update({
            where: {
                gymId_userId: {
                    gymId: currentStaff.organizationId,
                    userId: data.id,
                },
            },
            data: {
                isActive: false,
                deactivatedAt: new Date(),
                deactivatedBy: currentStaff.id,
                updatedAt: new Date(),
                deactivationReason: data.disabledReason,
            },
        });
        return {
            type: "SUCCESS",
            message: "Account disabled successfully.",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

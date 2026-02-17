"use server";

import { ActionResponse } from "@/shared/lib/action-response";
import { InviteStaffSchema } from "./staff-schema";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { auth } from "@/shared/config/auth.config";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { handleActionError } from "@/shared/lib/handle-action-error";

export const createStaffInvitation = async (
    formData: InviteStaffSchema,
): Promise<ActionResponse<void | unknown>> => {
    try {
        const result = await requirePermissionAndReturnUser("invitation", [
            "create",
        ]);

        await auth.api.createInvitation({
            body: {
                email: formData.email,
                role: formData.role,
                organizationId: result.organizationId,
                resend: true,
                firstName: formData.firstName,
                lastName: formData.lastName,
                personalMessage: formData.personalMessage,
            },
            headers: await headers(),
        });
        revalidatePath("/staff");
        return {
            type: "SUCCESS",
            message: "invitation sent successfully",
        };
    } catch (error) {
        return handleActionError(error);
    }
};
export const accepteStaffInvitation = async () => {};

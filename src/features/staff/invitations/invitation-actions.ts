"use server";

import { ActionResponse } from "@/shared/lib/action-response";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { auth } from "@/shared/config/auth.config";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { InviteStaffSchema } from "../staff-schema";
import {
    accepteInvitationSchema,
    AccepteInvitationSchema,
    revokeInvitationSchema,
    resendInvitationSchema,
    ResendInvitationSchema,
} from "./invitation-schema";
import {
    NotFoundError,
    SomethingWentWrongError,
    ValidationError,
} from "@/shared/lib/error-classes";
import prisma from "@/shared/config/prisma.config";
import { redirect } from "next/navigation";
import { RedirectType } from "next/navigation";
import { setCookie } from "@/shared/lib/cookie-util";
import { Route } from "next";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { constructUrl } from "@/shared/lib/server-utils";

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
export const accepteStaffInvitation = async (
    invitationId: AccepteInvitationSchema,
) => {
    let slug;
    try {
        const { success, data } =
            accepteInvitationSchema.safeParse(invitationId);
        if (!success) throw new ValidationError("Invalid data");

        //  provided headers to check auth no need to check auth again
        const res = await auth.api.acceptInvitation({
            body: {
                invitationId: data.id,
            },
            headers: await headers(),
        });
        if (!res) throw new SomethingWentWrongError();
        const gym = await prisma.gym.findUnique({
            where: {
                id: res.invitation.organizationId,
            },
            select: {
                slug: true,
                name: true,
            },
        });
        if (!gym) throw new ValidationError("domain not found");
        slug = gym?.slug;
        await setCookie({
            type: "success",
            message: `Welcome to the ${gym.name}! Your account has been created successfully.`,
        });
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
    const url = constructUrl("/dashboard", slug) as Route;
    redirect(url, RedirectType.replace);
};
export const deleteInvitation = async (
    invitationId: string,
): Promise<ActionResponse<void>> => {
    try {
        if (!invitationId)
            throw new ValidationError("Invitation ID is required");

        // check current logged in staff have permission to delete invitation
        const currentStaff = await requirePermissionAndReturnUser(
            "invitation",
            ["delete"],
        );

        //  delete the invitation from the db
        await prisma.invitation.delete({
            where: {
                id: invitationId,
                organizationId: currentStaff.organizationId,
            },
        });
        revalidatePath("/invitations");
        return {
            type: "SUCCESS",
            message: "Invitation deleted successfully",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

export const resendInvitation = async (
    invitationId: ResendInvitationSchema,
): Promise<ActionResponse<void>> => {
    try {
        const { success, data } =
            resendInvitationSchema.safeParse(invitationId);
        if (!success) throw new ValidationError("Invitation ID is required");

        // check current logged in staff have permission to resend invitation
        await requirePermissionAndReturnUser("invitation", [
            "create",
            "update",
        ]);

        // get the invitation details from the db
        const invitation = await prisma.invitation.findUnique({
            where: {
                id: data.id,
            },
        });

        //  check if invitation exists
        if (!invitation) throw new NotFoundError("Invitation not found");

        await auth.api.createInvitation({
            body: {
                resend: true,
                email: invitation.email,
                firstName: invitation.firstName,
                lastName: invitation.lastName,
                role: invitation.role as Role,
                organizationId: invitation.organizationId,
                personalMessage: invitation.personalMessage ?? undefined,
            },
            headers: await headers(),
        });
        revalidatePath("/invitations");
        return {
            type: "SUCCESS",
            message: "Invitation resent successfully",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

export const revokeInvitation = async (
    invitationId: revokeInvitationSchema,
): Promise<ActionResponse<void>> => {
    try {
        const { success, data } =
            revokeInvitationSchema.safeParse(invitationId);

        if (!success) throw new ValidationError("Invitation ID is required");

        // check current logged in staff have permission to revoke invitation
        await requirePermissionAndReturnUser("invitation", ["update"]);

        await auth.api.cancelInvitation({
            body: {
                invitationId: data.id,
            },
            headers: await headers(),
        });

        revalidatePath("/invitations");
        return {
            type: "SUCCESS",
            message: "Invitation revoked successfully",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

import { auth } from "@/shared/config/auth.config";
import prisma from "@/shared/config/prisma.config";
import { ForbiddenError } from "@/shared/lib/error-classes";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { cache } from "react";


export type Invitation = {
    id: string;
    token: string;
    email: string;
    role: string;
    status: string;
    firstName: string;
    lastName: string;
    personalMessage: string | null;
    inviterId: string;
    organizationId: string;
    createdAt: Date;
    expiresAt: Date;

    inviter: {
        name: string;
    };

    organization: {
        name: string;
        slug: string;
        logo: string | null;
    };
};
type InvitationEmailReturnType = | {
    type: "ERROR"
    message: string
} | {
    type: "SUCCESS"
    invitation: Invitation
}
export const getInvitationDetails = async (invitationId: string): Promise<InvitationEmailReturnType> => {
    try {
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: {
                inviter: { select: { name: true } },
                organization: {
                    select: { slug: true, logo: true, name: true }
                }
            }
        });

        if (!invitation) {
            return { type: "ERROR", message: "Invitation not found" };
        }

        if (new Date() > invitation.expiresAt) {
            return { type: "ERROR", message: "This invitation has expired" };
        }

        return {
            type: "SUCCESS",
            invitation,
        };

    } catch (error) {
        console.error("Invitation Fetch Error:", error);
        return { type: "ERROR", message: "Internal Server Error" };
    }
}
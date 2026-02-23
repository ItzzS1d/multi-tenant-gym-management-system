"server-only";
import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { cache } from "react";

export const getInvitationsList = cache(async () => {
    try {
        const currentStaff = await requirePermissionAndReturnUser(
            "invitation",
            ["read"],
        );

        const invitations = await prisma.invitation.findMany({
            where: {
                organizationId: currentStaff.organizationId,
                role: {
                    in: ["trainer", "admin"],
                },
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                status: true,
                expiresAt: true,
                createdAt: true,
                role: true,
                inviter: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        const records = invitations.map((invite) => ({
            ...invite,
            inviterName: invite.inviter.name,
        }));
        return records;
    } catch (error) {
        console.error(error);
        throw error;
    }
});

"server-only";

import { auth } from "@/shared/config/auth.config";
import prisma from "@/shared/config/prisma.config";
import { currentUser } from "@/shared/lib/session";
import { cache } from "react";

export const getUserPendingInvitesList = cache(async () => {
    try {
        const { user } = await currentUser();
        return await auth.api.listUserInvitations({
            query: {
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
});
export const getUserJoinedGymList = cache(async () => {
    try {
        const { user } = await currentUser();
        return await prisma.gymMember.findMany({
            where: {
                userId: user?.id,
            },
            select: {
                id: true,
                gym: {
                    select: {
                        name: true,
                        logo: true,
                        slug: true,
                    },
                },
                role: true,
                joinedOn: true,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
});

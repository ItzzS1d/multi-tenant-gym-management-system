"server-only";
import { cache } from "react";
import prisma from "../config/prisma.config";

export const getActiveOrganization = cache(async (userId: string) => {
    const result = await prisma.gymMember.findFirst({
        where: {
            userId,
            isActive: true,
        },
        select: {
            gymId: true,
            gym: {
                select: {
                    slug: true,
                },
            },
        },
    });
    return result;
});

export const getSubdomainDetails = cache(async (subdomain: string) => {
    // No auth check here - this needs to work for unauthenticated users too (e.g., /login page)
    const gym = await prisma?.gym.findFirst({
        where: {
            slug: subdomain,
        },
        select: {
            id: true,
        },
    });
    return gym;
});

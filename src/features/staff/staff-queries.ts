"server-only";

import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { cache } from "react";

export const getStaffStatsAndTableData = cache(async () => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("staff", [
            "read",
        ]);
        const staff = await prisma.gymMember.findMany({
            where: {
                gymId: currentStaff.organizationId,
                isActive: true,
                role: "trainer",
            },
            select: {
                id: true,
                role: true,
                isActive: true,
                joinedOn: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                        createdAt: true,
                        phone: true,
                    },
                },
            },
        });
        const stats = {
            totalStaff: staff.length,
            totalAdmins: staff.filter((staff) => staff.role === "admin").length,
            totalTrainers: staff.filter((staff) => staff.role === "trainer")
                .length,
        };
        const records = staff.map((staff) => ({
            gymMemberId: staff.id,
            isActive: staff.isActive,
            joinedOn: staff.joinedOn,
            role: staff.role,
            image: staff.user.image,
            email: staff.user.email || "Unknown",
            phone: staff.user.phone || "Unknown",
            name: staff.user.name || "Unknown",
            memberDetailsId: staff.user.id,
            userId: staff.user.id,
        }));
        return { stats, records };
    } catch (error) {
        console.error(error);
        throw error;
    }
});

export const getTrainersList = cache(async () => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("staff", [
            "read",
        ]);
        return await prisma.gymMember.findMany({
            where: {
                gymId: currentStaff.organizationId,
                isActive: true,
                role: "trainer",
            },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        createdAt: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
});

"server-only";

import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { cache } from "react";

export const getStaffStatsAndTableData = cache(async () => {
    try {
        const currentMember = await requirePermissionAndReturnUser("staff", [
            "read",
        ]);
        const staff = await prisma.gymMember.findMany({
            where: {
                gymId: currentMember.organizationId,
                role: {
                    in: ["admin", "trainer"],
                },
            },
            select: {
                id: true,
                isActive: true,
                joinedOn: true,
                role: true,
                memberDetails: {
                    select: {
                        id: true,
                        firstName: true,
                        gender: true,
                        lastName: true,
                        image: true,
                        email: true,
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
            image: staff?.memberDetails?.image,
            email: staff?.memberDetails?.email,
            phone: staff?.memberDetails?.phone,
            firstName: staff?.memberDetails?.firstName,
            lastName: staff?.memberDetails?.lastName,
            memberDetailsId: staff?.memberDetails?.id,
            gender: staff?.memberDetails?.gender,
        }));
        return { stats, records };
    } catch (error) {
        console.error(error);
        throw error;
    }
});

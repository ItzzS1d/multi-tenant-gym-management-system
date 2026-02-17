"server-only";
import { cache } from "react";
import {
    startOfDay,
    endOfDay,
    addDays,
    startOfMonth,
    endOfMonth,
    isWithinInterval,
    differenceInDays,
    isBefore,
} from "date-fns";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import prisma from "@/shared/config/prisma.config";

export const getMemberList = cache(async () => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "read",
        ]);

        const now = new Date();
        const todayStart = startOfDay(now);
        const sevenDaysFromNow = endOfDay(addDays(now, 7));

        const members = await prisma.gymMember.findMany({
            where: {
                gymId: currentStaff.organizationId,
                role: "member",
            },
            select: {
                id: true,
                isActive: true,
                joinedOn: true,
                assignedTrainer: {
                    select: {
                        name: true,
                    },
                },
                memberDetails: {
                    select: {
                        email: true,
                        gender: true,
                        image: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                memberPlans: {
                    orderBy: { endDate: "desc" }, // Get the most recent plan first
                    take: 1,
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                        status: true,
                        plan: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                durationInDays: true, // Fixed field name
                            },
                        },
                    },
                },
            },
        });

        const stats = {
            totalMembers: members.length,
            activeNow: members.filter((m) => m.isActive).length,

            newThisMonth: members.filter(
                (m) =>
                    m.joinedOn &&
                    isWithinInterval(m.joinedOn, {
                        start: startOfMonth(now),
                        end: endOfMonth(now),
                    }),
            ).length,

            expiringSoon: members.filter((m) => {
                const activePlan = m.memberPlans[0];
                return (
                    activePlan &&
                    isWithinInterval(new Date(activePlan.endDate), {
                        start: todayStart,
                        end: sevenDaysFromNow,
                    })
                );
            }).length,
        };

        const records = members.map((m) => {
            const planDetails = m.memberPlans[0];
            const endDate = planDetails ? new Date(planDetails.endDate) : null;

            return {
                id: m.id,
                image: m.memberDetails?.image,
                email: m.memberDetails?.email,
                firstName: m.memberDetails?.firstName || "NA",
                lastName: m.memberDetails?.lastName || "NA",
                joinedAt: m.joinedOn,
                gender: m.memberDetails?.gender || "NA",
                assignedTrainer:
                    m.assignedTrainer?.name || "No Trainer assigned",

                // Plan info (with safety checks)
                planName: planDetails?.plan.name || "No Plan",
                planDuration: planDetails?.plan.durationInDays || 0,
                planPrice: planDetails?.plan.price || 0,
                planStartedDate: planDetails?.startDate || null,
                planEndedDate: planDetails?.endDate || null,

                daysLeft: endDate
                    ? Math.max(0, differenceInDays(endDate, todayStart))
                    : null,

                status: !m.isActive
                    ? "SUSPENDED"
                    : !endDate
                      ? "NO_PLAN"
                      : isBefore(endDate, todayStart)
                        ? "EXPIRED"
                        : "ACTIVE",
            };
        });

        return {
            stats,
            records,
        };
    } catch (error) {
        console.error("Error in getMemberList:", error);
        throw error;
    }
});

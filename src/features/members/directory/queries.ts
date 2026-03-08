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
import { normalizeName } from "@/shared/lib/utils";

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
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                assignedTrainer: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                memberDetails: {
                    select: {
                        gender: true,
                        image: true,
                    },
                },
                memberPlans: {
                    orderBy: { endDate: "desc" },
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
                                durationInDays: true,
                            },
                        },
                    },
                },
            },
        });

        const stats = {
            totalMembers: members.length,
            active: members.filter(
                (m) => m.isActive && m.memberPlans[0]?.status === "ACTIVE",
            ).length,

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
                const endDate = activePlan
                    ? new Date(activePlan.endDate)
                    : null;
                return (
                    activePlan &&
                    endDate &&
                    isWithinInterval(endDate, {
                        start: todayStart,
                        end: sevenDaysFromNow,
                    })
                );
            }).length,

            expired: members.filter((m) => {
                const activePlan = m.memberPlans[0];
                const endDate = activePlan
                    ? new Date(activePlan.endDate)
                    : null;
                return (
                    (activePlan && activePlan.status === "EXPIRED") ||
                    (endDate && isBefore(endDate, todayStart))
                );
            }).length,
        };

        const records = members.map((m) => {
            const planDetails = m.memberPlans[0];
            const endDate = planDetails ? new Date(planDetails.endDate) : null;

            return {
                id: m.id,
                image: m.memberDetails?.image,
                email: m.user.email,
                firstName: normalizeName(m.user.name, "first"),
                lastName: normalizeName(m.user.name, "last"),
                joinedAt: m.joinedOn,
                gender: m.memberDetails?.gender,
                assignedTrainerName:
                    m.assignedTrainer?.user.name || "No Trainer assigned",
                assignedTrainerId: m.assignedTrainer?.id ?? null,

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
                    : !planDetails
                      ? "NO_PLAN"
                      : planDetails.status,
            };
        });
        console.info("records", members);

        return {
            stats,
            records,
        };
    } catch (error) {
        console.error("Error in getMemberList:", error);
        throw error;
    }
});

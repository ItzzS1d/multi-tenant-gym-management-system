"server-only";
import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { cache } from "react";

export const getPlansDashboardData = cache(async () => {
    try {
        const currentMember = await requirePermissionAndReturnUser("plan", [
            "read",
        ]);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const [plans, monthlyRevenueAgg] = await Promise.all(
            [
                prisma.plan.findMany({
                    where: { gymId: currentMember.organizationId },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        durationInDays: true,
                        price: true,
                        isActive: true,
                        memberPlans: {
                            select: {
                                payments: {
                                    select: {
                                        amountPaid: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                }),

                // 2. Monthly Revenue (Payments in last 30 days)
                prisma.payment.aggregate({
                    where: {
                        gymId: currentMember.organizationId,
                        paymentReceivedDate: { gte: thirtyDaysAgo },
                    },
                    _sum: { amountPaid: true },
                }),


            ],
        );

        const initial = plans.map((plan) => {
            const memberCount = plan.memberPlans.length;

            const totalRevenue = plan.memberPlans.reduce((acc, mp) => {
                const planPaymentsTotal = mp.payments.reduce(
                    (pAcc, p) => pAcc + p.amountPaid,
                    0,
                );
                return acc + planPaymentsTotal;
            }, 0);

            return {
                id: plan.id,
                name: plan.name,
                members: memberCount,
                description: plan.description,
                totalRevenue,
                durationInDays: plan.durationInDays,
                price: plan.price,
                isActive: plan.isActive,
            };
        });


        const activePlansCount = plans.filter((p) => p.isActive).length;

        let popularPlanId = "";
        if (initial.length > 0) {
            const sortedByPopularity = [...initial].sort((a, b) => {
                const memberDiff = b.members - a.members;
                if (memberDiff !== 0) return memberDiff;
                return b.totalRevenue - a.totalRevenue;
            });

            if (sortedByPopularity[0].members > 0) {
                popularPlanId = sortedByPopularity[0].id;
            }
        }

        const formattedPlans = initial.map((plan) => ({
            ...plan,
            isPopular: plan.id === popularPlanId,
        }));

        return {
            plans: formattedPlans,
            stats: {
                totalPlans: plans.length,
                monthlyRevenue: monthlyRevenueAgg._sum.amountPaid || 0,
                activePlansCount: activePlansCount,
            },
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return {
            plans: [],
            stats: {
                totalPlans: 0,
                monthlyRevenue: 0,
                activePlansCount: 0,
            },
        };
    }
});

"server-only";

import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { cache } from "react";
import { formatCurrency, formatDate } from "@/shared/lib/utils";

export const getMemberPaymentHistoryDetails = cache(
    async (memberId: string) => {
        try {
            const currentStaff = await requirePermissionAndReturnUser(
                "member",
                ["read"],
            );

            const activePlan = await prisma.memberPlan.findFirst({
                where: {
                    gymId: currentStaff.organizationId,
                    gymMemberId: memberId,
                    status: "ACTIVE",
                },
                select: { endDate: true },
                orderBy: { createdAt: "desc" },
            });

            const memberPlans = await prisma.memberPlan.findMany({
                where: {
                    gymId: currentStaff.organizationId,
                    gymMemberId: memberId,
                },
                select: {
                    plan: {
                        select: {
                            name: true,
                        },
                    },
                    payments: {
                        select: {
                            paymentReceivedDate: true,
                            method: true,
                            amountPaid: true,
                        },
                        orderBy: {
                            paymentReceivedDate: "desc",
                        },
                    },
                },
            });

            const paymentRecords = memberPlans.flatMap((plan) =>
                plan.payments.map((payment) => ({
                    date: payment.paymentReceivedDate,
                    amount: payment.amountPaid,
                    method: payment.method,
                    memberPlan: plan.plan.name,
                })),
            );

            const totalRevenue = paymentRecords.reduce(
                (acc, payment) => acc + (payment.amount || 0),
                0,
            );
            const lastPayment = paymentRecords[0];
            const nextDue = activePlan?.endDate
                ? new Date(activePlan.endDate)
                : null;

            const stats = {
                totalRevenue: formatCurrency(totalRevenue),
                nextDue: nextDue ? formatDate(nextDue) : "No Active Plan",
                lastPayment: lastPayment
                    ? formatCurrency(lastPayment.amount)
                    : "₹0",
            };

            return {
                stats,
                records: paymentRecords,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
);

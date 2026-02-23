"server-only";

import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { cache } from "react";
import {
    MonthlyAttendanceListInput,
    monthlyAttendanceListSchema,
} from "./validations";
import { ValidationError } from "@/shared/lib/error-classes";
import {
    differenceInDays,
    eachDayOfInterval,
    endOfMonth,
    isSunday,
    startOfDay,
    startOfMonth,
} from "date-fns";

export const getAllMembersList = cache(async () => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "read",
        ]);
        return await prisma.gymMember.findMany({
            where: {
                gymId: currentStaff.organizationId,
                role: "member",
                isActive: true,
            },
            select: {
                id: true,
                user: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
                memberDetails: {
                    select: {
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        console.error(error);
    }
});

export const getMonthlyAttendanceList = cache(
    async (params: MonthlyAttendanceListInput) => {
        try {
            const { success, data } =
                monthlyAttendanceListSchema.safeParse(params);

            if (!success) throw new ValidationError("Invalid input");

            const currentStaff = await requirePermissionAndReturnUser(
                "attendance",
                ["read"],
            );

            const baseDate = new Date(data.year, data.month - 1);

            const startDate = startOfMonth(baseDate);
            const endDate = endOfMonth(baseDate);

            const attendance = await prisma.attendance.findMany({
                where: {
                    gymId: currentStaff.organizationId,
                    gymMemberId: data.memberId,
                    attendanceDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                select: {
                    attendanceDate: true,
                    totalDuration: true,
                    checkInAt: true,
                    checkOutAt: true,
                    autoCheckout: true,
                },
                orderBy: {
                    attendanceDate: "asc",
                },
            });

            // ✅ Calculate working days (exclude Sundays)
            const allDays = eachDayOfInterval({
                start: startDate,
                end: endDate,
            });

            const workingDays = allDays.filter((day) => !isSunday(day)).length;

            // Since one attendance per day is enforced
            const present = attendance.length;

            let totalDurationSum = 0;
            let durationCount = 0;

            for (const item of attendance) {
                if (item.totalDuration != null) {
                    totalDurationSum += item.totalDuration;
                    durationCount++;
                }
            }

            const attendancePercentage =
                workingDays > 0 ? (present / workingDays) * 100 : 0;

            const averageDuration =
                durationCount > 0 ? totalDurationSum / durationCount : 0;

            return {
                stats: {
                    present,
                    absent: Math.max(0, workingDays - present),
                    attendancePercentage: Number(
                        attendancePercentage.toFixed(2),
                    ),
                    averageDuration: Math.round(averageDuration),
                },
                records: attendance,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
);

"server-only";
import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import {
    eachYearOfInterval,
    endOfMonth,
    format,
    getYear,
    isAfter,
    isBefore,
    setMonth,
    setYear,
    startOfDay,
    startOfMonth,
} from "date-fns";
import { cache } from "react";

export const getMemberOverViewDetails = cache(async (memberId: string) => {
    try {
        const currentUser = await requirePermissionAndReturnUser("member", [
            "read",
        ]);

        return await prisma.gymMember.findUniqueOrThrow({
            where: {
                id: memberId,
                gymId: currentUser.organizationId,
            },
            select: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                isActive: true,
                role: true,
                id: true,
                attendanceEntries: {
                    select: {
                        checkInAt: true,
                        checkOutAt: true,
                        attendanceDate: true,
                        recordedByName: true,
                    },
                    orderBy: {
                        checkInAt: "desc",
                    },
                    take: 5,
                },
                memberPlans: {
                    where: {
                        gymId: currentUser.organizationId,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        status: true,
                        endDate: true,
                        plan: {
                            select: {
                                name: true,
                                price: true,
                            },
                        },
                        payments: {
                            orderBy: {
                                createdAt: "desc",
                            },
                            take: 1,
                            select: {
                                method: true,
                            },
                        },
                    },
                },
                memberDetails: {
                    select: {
                        id: true,
                        image: true,
                        dob: true,
                        emergencyName: true,
                        emergencyPhone: true,
                        gender: true,
                        address: true,
                        relationship: true,
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

export const getAttendanceAnalytics = cache(
    async ({
        memberId,
        month,
        year,
    }: {
        memberId: string;
        month?: number; // 1-12
        year?: number;
    }) => {
        const currentStaff = await requirePermissionAndReturnUser(
            "attendance",
            ["read"],
        );

        // 1. Fetch member join date for boundary safety
        const member = await prisma.gymMember.findUnique({
            where: { id: memberId, gymId: currentStaff.organizationId },
            select: { createdAt: true },
        });

        const joinDate = member?.createdAt ?? new Date();

        // 2. Determine target month/year (default to now)
        let referenceDate = new Date();
        if (year) referenceDate = setYear(referenceDate, year);
        if (month) referenceDate = setMonth(referenceDate, month - 1);

        // 3. Calculate Boundaries
        let startDate = startOfMonth(referenceDate);
        const endDate = endOfMonth(referenceDate);

        // If the selected month is when they joined, start from their join day
        if (isBefore(startDate, joinDate) && isAfter(endDate, joinDate)) {
            startDate = startOfDay(joinDate);
        }

        // If the entire selected month is BEFORE they joined, return empty
        if (isAfter(startDate, new Date()) || isBefore(endDate, joinDate)) {
            return {
                records: [],
                stats: {
                    totalVisits: 0,
                    avgDuration: 0,
                    peakHourLabel: "N/A",
                },
                message: "No records for this period",
            };
        }

        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                gymMemberId: memberId,
                gymId: currentStaff.organizationId,
                attendanceDate: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                checkInAt: true,
                checkOutAt: true,
                attendanceDate: true,
                recordedByName: true,
                totalDuration: true,
            },
            orderBy: { checkInAt: "desc" },
        });

        // 4. Analytics Processing
        const stats = attendanceRecords.reduce(
            (acc, log) => {
                const hour = new Date(log.checkInAt).getHours();
                acc.hourBuckets[hour] = (acc.hourBuckets[hour] || 0) + 1;

                if (log.totalDuration) {
                    acc.totalMinutes += log.totalDuration;
                    acc.completedSessions += 1;
                }
                return acc;
            },
            {
                hourBuckets: Array(24).fill(0),
                totalMinutes: 0,
                completedSessions: 0,
            },
        );

        const maxVisits = Math.max(...stats.hourBuckets);
        const peakHourIndex = stats.hourBuckets.indexOf(maxVisits);
        const formattedPeakHour =
            maxVisits > 0
                ? format(new Date().setHours(peakHourIndex, 0), "hh a")
                : "N/A";

        return {
            records: attendanceRecords,
            stats: {
                totalVisits: attendanceRecords.length,
                avgDuration:
                    stats.completedSessions > 0
                        ? Math.round(
                              stats.totalMinutes / stats.completedSessions,
                          )
                        : 0,
                peakHourLabel: formattedPeakHour,
            },
        };
    },
);
export const getMemberNotes = cache(async (memberId: string) => {
    try {
        const organization = await requirePermissionAndReturnUser("notes", [
            "read",
        ]);
        return await prisma.staffNote.findMany({
            where: {
                memberId: memberId,
                gymId: organization.organizationId,
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                memberId: true,
                staff: {
                    select: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        console.error(error);
        return [];
    }
});

export const getPlansList = cache(async () => {
    try {
        const currentMember = await requirePermissionAndReturnUser("plan", [
            "read",
        ]);
        return await prisma.plan.findMany({
            where: {
                gymId: currentMember.organizationId,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                price: true,
                durationInDays: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
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
                    },
                },
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
});

export const getMemberActivePlanDetails = cache(async (memberId: string) => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "read",
        ]);
        return await prisma.memberPlan.findFirst({
            where: {
                gymId: currentStaff.organizationId,
                gymMemberId: memberId,
                status: "ACTIVE",
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                status: true,
                plan: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
});

export const getMemberAttendanceYears = cache(async (memberId: string) => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "read",
        ]);
        const member = await prisma.gymMember.findUnique({
            where: { id: memberId, gymId: currentStaff.organizationId },
            select: { createdAt: true },
        });

        const joinDate = member?.createdAt ?? new Date();
        const now = new Date();

        const availableYears = eachYearOfInterval({
            start: joinDate,
            end: now,
        })
            .map((date) => getYear(date))
            .reverse();

        return {
            availableYears,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
});

"server-only";

import prisma from "@/shared/config/prisma.config";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { endOfDay, isToday, startOfDay } from "date-fns";
import { cache } from "react";
import {
    AttendanceLogDateInput,
    attendanceLogDateSchema,
} from "./attendance-validations";

export const getCheckInCheckOutStatus = cache(async () => {
    try {
        const currentStaff = await requirePermissionAndReturnUser(
            "attendance",
            ["read"],
        );
        const startDay = startOfDay(new Date());
        const endDay = endOfDay(new Date());
        return await prisma.attendance.findFirst({
            where: {
                gymId: currentStaff.organizationId,
                gymMemberId: currentStaff.id,
                attendanceDate: {
                    gte: startDay,
                    lte: endDay,
                },
            },
            select: {
                id: true,
                checkInAt: true,
                checkOutAt: true,
            },
        });
    } catch (error) {
        console.error("Error fetching attendance status:", error);
        throw error;
    }
});

export const getMembersListAndAttendanceLog = cache(
    async (inputDate: AttendanceLogDateInput) => {
        try {
            const { date } = attendanceLogDateSchema.parse(inputDate);
            const org = await requirePermissionAndReturnUser("attendance", [
                "read",
            ]);

            const gymSettings = await prisma.gym.findUnique({
                where: { id: org.organizationId },
                select: { openingTime: true, closingTime: true },
            });

            const openTime = gymSettings?.openingTime || "06:00";
            const closeTime = gymSettings?.closingTime || "22:00";

            const startDay = startOfDay(date);
            const endDay = endOfDay(date);

            const members = await prisma.gymMember.findMany({
                where: {
                    gymId: org.organizationId,
                    role: "member",
                },
                select: {
                    id: true,
                    isActive: true,
                    user: {
                        select: { id: true, name: true, phone: true },
                    },
                    attendanceEntries: {
                        where: {
                            gymId: org.organizationId,
                            attendanceDate: { gte: startDay, lte: endDay },
                        },
                        select: { id: true, checkInAt: true, checkOutAt: true },
                    },
                },
            });

            const memberData = members.map((m) => {
                const todayRecord = m.attendanceEntries[0] || null;
                const hasCheckedIn = !!todayRecord?.checkInAt;
                const hasCheckedOut = !!todayRecord?.checkOutAt;
                const isCurrentlyInside = hasCheckedIn && !hasCheckedOut;

                return {
                    user: {
                        Id: m.user.id,
                        name: m.user.name,
                        phone: m.user.phone,
                    },
                    member: { memberId: m.id, isActive: m.isActive },
                    attendance: {
                        status: hasCheckedIn ? "Present" : "Absent",
                        attendanceId: todayRecord?.id || null,
                        isInsideGym: isCurrentlyInside,
                        canCheckIn: !hasCheckedIn,
                        canCheckOut: isCurrentlyInside,
                        isFinished: hasCheckedIn && hasCheckedOut,
                        checkIn: todayRecord?.checkInAt || null,
                        checkOut: todayRecord?.checkOutAt || null,
                        gymHours: `${openTime} - ${closeTime}`,
                    },
                };
            });

            const stats = {
                totalPresent: memberData.filter(
                    (m) => m.attendance.status === "Present",
                ).length,
                currentlyInside: memberData.filter(
                    (m) => m.attendance.isInsideGym,
                ).length,
                checkedOut: memberData.filter((m) => m.attendance.isFinished)
                    .length,
                yetToArrive: memberData.filter(
                    (m) =>
                        m.member.isActive && m.attendance.status === "Absent",
                ).length,
            };

            // Today: only show members who checked in. Previous days: show all.
            const logRecords = isToday(date)
                ? memberData.filter((m) => m.attendance.status === "Present")
                : memberData;

            // 3. Return the final object for the StatsSection
            return { records: logRecords, allMembers: memberData, stats };
        } catch (err) {
            console.error("Error fetching member list:", err);
            throw err;
        }
    },
);

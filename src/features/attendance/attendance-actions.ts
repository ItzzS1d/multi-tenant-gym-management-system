"use server";

import prisma from "@/shared/config/prisma.config";
import { ActionResponse } from "@/shared/lib/action-response";
import {
    AlreadyExistsError,
    ForbiddenError,
    ValidationError,
} from "@/shared/lib/error-classes";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import { differenceInMinutes, endOfDay, startOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { PunchMemberInput, punchMemberSchema } from "./attendance-validations";

export const clockInOut = async (
    status: "in" | "out",
): Promise<ActionResponse<void>> => {
    try {
        const currentStaff = await requirePermissionAndReturnUser(
            "attendance",
            ["create"],
        );
        const startDay = startOfDay(new Date());
        const endDay = endOfDay(new Date());
        const attendance = await prisma.attendance.findFirst({
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
                gymMemberId: true,
            },
        });
        if (attendance && attendance.gymMemberId !== currentStaff.id) {
            throw new ForbiddenError("You can only clock in/out for yourself");
        }
        if (status === "in") {
            if (attendance && attendance.checkInAt) {
                throw new AlreadyExistsError("Already clocked in for today");
            }
            await prisma.attendance.create({
                data: {
                    gymId: currentStaff.organizationId,
                    gymMemberId: currentStaff.id,
                    checkInAt: new Date(),
                    attendanceDate: new Date(),
                    recordedById: currentStaff.id,
                    recordedByName: currentStaff.user.name,
                },
            });

            revalidatePath("/", "layout");
            return {
                type: "SUCCESS",
                message: "Clocked in successfully",
            };
        } else if (status === "out") {
            if (!attendance || !attendance.checkInAt) {
                throw new ValidationError(
                    "You need to clock in before clocking out",
                );
            }
            if (attendance.checkOutAt) {
                throw new ValidationError("Already clocked out for today");
            }
            const totalMinutes = differenceInMinutes(
                new Date(),
                attendance.checkInAt,
            );

            await prisma.attendance.update({
                where: { id: attendance.id },
                data: {
                    checkOutAt: new Date(),
                    totalDuration: totalMinutes,
                },
            });
            revalidatePath("/", "layout");
            return {
                type: "SUCCESS",
                message: "Clocked out successfully",
            };
        } else {
            throw new ValidationError("Invalid status");
        }
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

export const punchMember = async (
    input: PunchMemberInput,
): Promise<ActionResponse<void>> => {
    try {
        const { memberId, status } = punchMemberSchema.parse(input);
        const currentStaff = await requirePermissionAndReturnUser(
            "attendance",
            ["create"],
        );
        const now = new Date()
        const startDay = startOfDay(now);
        const endDay = endOfDay(now);

        const attendance = await prisma.attendance.findFirst({
            where: {
                gymId: currentStaff.organizationId,
                gymMemberId: memberId,
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

        if (status === "in") {
            if (attendance && attendance.checkInAt) {
                throw new AlreadyExistsError(
                    "Member already checked in for today",
                );
            }
            await prisma.attendance.create({
                data: {
                    gymId: currentStaff.organizationId,
                    gymMemberId: memberId,
                    checkInAt: now,
                    attendanceDate: now,
                    recordedById: currentStaff.id,
                    recordedByName: currentStaff.user.name,
                },
            });

            revalidatePath("/attendance/check-in-out");
            return {
                type: "SUCCESS",
                message: "Member checked in successfully",
            };
        } else if (status === "out") {
            if (!attendance || !attendance.checkInAt) {
                throw new ValidationError(
                    "Member needs to check in before checking out",
                );
            }
            if (attendance.checkOutAt) {
                throw new ValidationError(
                    "Member already checked out for today",
                );
            }
            const totalMinutes = differenceInMinutes(
                now,
                attendance.checkInAt,
            );

            await prisma.attendance.update({
                where: { id: attendance.id },
                data: {
                    checkOutAt: now,
                    totalDuration: totalMinutes,
                },
            });
            revalidatePath("/attendance/check-in-out");
            return {
                type: "SUCCESS",
                message: "Member checked out successfully",
            };
        } else {
            throw new ValidationError("Invalid status");
        }
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

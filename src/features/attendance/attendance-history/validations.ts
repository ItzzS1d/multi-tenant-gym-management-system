import * as z from "zod";

export const monthlyAttendanceListSchema = z.object({
    year: z.number().default(new Date().getFullYear()),
    month: z.number().min(0).max(11).default(new Date().getMonth()),
    memberId: z.cuid(),
    gymId: z.cuid(),
});

export type MonthlyAttendanceListInput = z.infer<
    typeof monthlyAttendanceListSchema
>;

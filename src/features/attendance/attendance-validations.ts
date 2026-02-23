import * as z from "zod";

export const punchMemberSchema = z.object({
    memberId: z.cuid(),
    status: z.enum(["in", "out"]),
});

export type PunchMemberInput = z.infer<typeof punchMemberSchema>;

export const attendanceLogDateSchema = z.object({
    date: z.coerce.date().default(() => new Date()),
});

export type AttendanceLogDateInput = z.infer<typeof attendanceLogDateSchema>;

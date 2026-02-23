
import { getMembersListAndAttendanceLog } from "@/features/attendance/attendance-queries";
import { attendanceLogDateSchema } from "@/features/attendance/attendance-validations";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    try {
        const { date } = attendanceLogDateSchema.parse({ date: dateParam ?? undefined });
        const data = await getMembersListAndAttendanceLog({ date });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
};

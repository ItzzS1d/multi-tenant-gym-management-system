import { getMonthlyAttendanceList } from "@/features/attendance/attendance-history/queries";
import { monthlyAttendanceListSchema } from "@/features/attendance/attendance-history/validations";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ gymId: string; memberId: string }> },
) => {
    const { gymId, memberId } = await params;
    const { searchParams } = new URL(req.url);

    const input = {
        gymId,
        memberId,
        month: Number(searchParams.get("month")),
        year: Number(searchParams.get("year")),
    };

    try {
        const result = monthlyAttendanceListSchema.safeParse(input);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid parameters", details: result.error.format() },
                { status: 400 },
            );
        }

        const res = await getMonthlyAttendanceList(result.data);
        return NextResponse.json(res);
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
};

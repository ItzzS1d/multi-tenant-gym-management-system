import { getAttendanceAnalytics } from "@/features/members/new/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ memberId: string }> },
) {
    try {
        const { memberId } = await params;
        const searchParams = request.nextUrl.searchParams;
        const monthParam = searchParams.get("month");
        const yearParam = searchParams.get("year");

        const month = monthParam ? parseInt(monthParam) : undefined;
        const year = yearParam ? parseInt(yearParam) : undefined;

        const data = await getAttendanceAnalytics({
            memberId,
            month,
            year,
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching attendance analytics:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}

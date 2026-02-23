import { getMembersListAndAttendanceLog } from "@/features/attendance/attendance-queries";
import AttendanceLogTabel from "@/features/attendance/clock-in-out/components/attendance-log";
import { ATTENDANCE_LOG_TABLE_COLUMNS } from "@/features/attendance/clock-in-out/components/attendance-log-columns";
import PunchInOutStation from "@/features/attendance/clock-in-out/components/punching";
import TableSkeleton from "@/shared/components/table/table-skeleton";
import { requireActiveOrganization } from "@/shared/lib/session";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Attendance | Check-Ins & History",
    description: "Track member check-ins and attendance history.",
};

const AttendanceCheckInOut = async ({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) => {
    const { date } = await searchParams;
    const selectedDate = date ? new Date(date) : new Date();
    const gymId = await requireActiveOrganization();

    // Stats are always for today
    const todayPromise = getMembersListAndAttendanceLog({ date: new Date() });

    // Table is for the selected date (initial load)
    const attendanceLogTabelPromise = getMembersListAndAttendanceLog({
        date: selectedDate,
    });

    return (
        <main className="space-y-5">
            <Suspense>
                <PunchInOutStation attendanceLogPromise={todayPromise} />
            </Suspense>
            <Suspense fallback={<TableSkeleton />}>
                <AttendanceLogTabel
                    attendanceLogPromise={attendanceLogTabelPromise}
                    columns={ATTENDANCE_LOG_TABLE_COLUMNS}
                    gymId={gymId}
                />
            </Suspense>
        </main>
    );
};

export default AttendanceCheckInOut;

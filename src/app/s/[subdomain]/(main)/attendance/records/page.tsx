import AttendanceHistoryCalender from "@/features/attendance/attendance-history/components/AttendanceHistoryCalender";
import { getAllMembersList } from "@/features/attendance/attendance-history/queries";
import RecordsClenderSkeleton from "@/features/attendance/clock-in-out/components/records-calender-skeleton";
import { requireActiveOrganization } from "@/shared/lib/session";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Attendance | Record & History",
    description: "Track member check-ins and attendance history.",
};

const AttendanceRecord = async () => {
    const memberListProimse = getAllMembersList();
    const orgId = await requireActiveOrganization();
    return (
        <main>
            <Suspense fallback={<RecordsClenderSkeleton />}>
                <AttendanceHistoryCalender
                    membersListPromise={memberListProimse}
                    gymId={orgId}
                />
            </Suspense>
        </main>
    );
};

export default AttendanceRecord;

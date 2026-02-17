import React, { Suspense } from "react";
import AttendanceLogTable from "./log-table";
import {
    getAttendanceAnalytics,
    getMemberAttendanceYears,
} from "../../new/queries";
import AttendanceLogTableSkeleton from "./skeletons/table-skeleton";
import { ATTENDANCE_TABLE_COLUMNS } from "./table-columns";
import StatsCardSkeleton from "./skeletons/stats-card-skeleton";
import Stats from "./stats";

const AttendanceTab = async ({
    memberId,
    month,
    year,
}: {
    memberId: string;
    month?: number;
    year?: number;
}) => {
    const attendancePromise = getAttendanceAnalytics({
        memberId,
        month,
        year,
    });
    const months = await getMemberAttendanceYears(memberId);

    return (
        <div>
            <Suspense fallback={<StatsCardSkeleton />}>
                <Stats statsPromise={attendancePromise} />
            </Suspense>
            <div className="grid grid-cols-1 ">
                <Suspense fallback={<StatsCardSkeleton />}>
                    {/*<AttendanceInsights />*/}
                </Suspense>
                <Suspense fallback={<AttendanceLogTableSkeleton />}>
                    <AttendanceLogTable
                        attendancePromise={attendancePromise}
                        columns={ATTENDANCE_TABLE_COLUMNS}
                        availableYears={months.availableYears}
                        month={month}
                        year={year}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default AttendanceTab;

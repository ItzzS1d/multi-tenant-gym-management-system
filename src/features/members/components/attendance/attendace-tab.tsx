import React, { Suspense } from "react";
import AttendanceLogTable from "./log-table";
import {
    getAttendanceAnalytics,
    getMemberAttendanceYears,
} from "../../new/queries";
import AttendanceLogTableSkeleton from "./skeletons/table-skeleton";
import { ATTENDANCE_TABLE_COLUMNS } from "./table-columns";
import StatsCardSkeleton from "./skeletons/stats-card-skeleton";
import { StatsSection } from "@/shared/components/stats/stats-section";
import { BarChart, Clock, Timer } from "lucide-react";

const ATTENDANCE_STATS_CONFIG = {
    totalVisits: {
        icon: <BarChart size={14} />,
        description: "Total number of visits",
    },
    avgDuration: {
        icon: <Timer size={14} />,
        description: "Average duration of each visit",
    },
    peakHourLabel: {
        title: "Peak Visit Time",
        icon: <Clock size={14} />,
        description: "Peak time of day for visits",
    },
};

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
                <StatsSection
                    config={ATTENDANCE_STATS_CONFIG}
                    promise={attendancePromise}
                    gridCount={3}
                />
            </Suspense>
            <div className="grid grid-cols-1 ">
                <Suspense fallback={<StatsCardSkeleton />}>
                    {/*<AttendanceInsights />*/}
                </Suspense>
                <Suspense fallback={<AttendanceLogTableSkeleton />}>
                    <AttendanceLogTable
                        attendancePromise={attendancePromise.then(
                            (res) => res.records,
                        )}
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

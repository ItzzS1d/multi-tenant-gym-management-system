import React, { use } from "react";
import { getAttendanceAnalytics } from "../../new/queries";
import StatsCard from "./stats-card";
import { BarChart, CircleStop, Clock, Timer } from "lucide-react";
import { startTask } from "better-auth/client";

type StatsProps = ReturnType<typeof getAttendanceAnalytics>;
const Stats = ({ statsPromise }: { statsPromise: StatsProps }) => {
    const { stats } = use(statsPromise);
    return (
        <div className="grid grid-cols-1 mb-3 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatsCard
                title="Total Visits"
                icon={<BarChart />}
                value={stats.totalVisits}
                description="Total number of visits"
            />
            <StatsCard
                title="Average Duration"
                icon={<Timer />}
                value={stats.avgDuration}
                description="Average duration of each visit"
            />
            <StatsCard
                title="Peak Visit Time"
                icon={<Clock />}
                value={stats.peakHourLabel}
                description="Peak time of day for visits"
            />
        </div>
    );
};

export default Stats;

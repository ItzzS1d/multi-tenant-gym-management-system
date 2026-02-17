import { Dumbbell, User, Users } from "lucide-react";
import React, { Suspense } from "react";
import { StatsConfigItem } from "../members/page";
import { StatsSection } from "@/shared/components/stats/stats-section";
import TableSkeleton from "@/shared/components/table/table-skeleton";
import { getStaffStatsAndTableData } from "@/features/staff/staff-queries";
import StaffTable from "@/features/staff/components/staff-table";
import { STAFF_TABLE_COLUMNS } from "@/features/staff/components/staff-table-columns";

const STAFF_STATS_CONFIG = [
    {
        title: "Total Staff",
        icon: <Users size={20} />,
        description: "Total number of members",
        statKey: "totalStaff",
    },
    {
        title: "Active Admins",
        icon: <User size={20} />,
        description: "Members Joined this month",
        statKey: "totalAdmins",
    },
    {
        title: "Active Trainers",
        icon: <Dumbbell size={20} />,
        description: "Members Membership Expiring soon",
        statKey: "totalTrainers",
    },
] as const satisfies StatsConfigItem[];
const Staff = () => {
    const staffListPromise = getStaffStatsAndTableData();
    return (
        <main>
            <StatsSection
                items={STAFF_STATS_CONFIG}
                promise={staffListPromise}
            />
            <Suspense fallback={<TableSkeleton />}>
                <StaffTable
                    StaffListPromise={staffListPromise}
                    columns={STAFF_TABLE_COLUMNS}
                />
            </Suspense>
        </main>
    );
};

export default Staff;

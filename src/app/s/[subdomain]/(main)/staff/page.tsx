import { Dumbbell, User, Users } from "lucide-react";
import React, { Suspense } from "react";
import { StatsSection } from "@/shared/components/stats/stats-section";
import { StatsCardsSkeleton } from "@/shared/components/stats/stats-card-skeleton";
import TableSkeleton from "@/shared/components/table/table-skeleton";
import { getStaffStatsAndTableData } from "@/features/staff/staff-queries";
import StaffTable from "@/features/staff/components/staff-table";
import { STAFF_TABLE_COLUMNS } from "@/features/staff/components/staff-table-columns";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Staff",
    description: "Manage your gym staff, trainers, and admins.",
};

const STAFF_STATS_CONFIG = {
    totalStaff: {
        icon: <Users size={14} />,
        description: "Total number of staff",
    },
    totalAdmins: {
        icon: <User size={14} />,
        description: "Active admin accounts",
    },
    totalTrainers: {
        icon: <Dumbbell size={14} />,
        description: "Active trainer accounts",
    },
};

const Staff = () => {
    const staffListPromise = getStaffStatsAndTableData();
    return (
        <main className="space-y-5">
            <Suspense fallback={<StatsCardsSkeleton length={3} />}>
                <StatsSection
                    config={STAFF_STATS_CONFIG}
                    promise={staffListPromise}
                    gridCount={3}
                />
            </Suspense>
            <Suspense fallback={<TableSkeleton />}>
                <StaffTable
                    data={staffListPromise.then((res) => res.records)}
                    columns={STAFF_TABLE_COLUMNS}
                />
            </Suspense>
        </main>
    );
};

export default Staff;

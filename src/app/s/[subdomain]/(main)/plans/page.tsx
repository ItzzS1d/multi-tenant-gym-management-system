import type { Metadata } from "next";
import PlansTable from "@/features/plans/components/plans-table";
import { PLANS_TABLE_COLUMNS } from "@/features/plans/components/plans-table-columns";
import { getPlansDashboardData } from "@/features/plans/queries";
import React, { Suspense } from "react";
import { Activity, Banknote, Folder } from "lucide-react";
import { StatsSection } from "@/shared/components/stats/stats-section";
import { StatsCardsSkeleton } from "@/shared/components/stats/stats-card-skeleton";
import TableSkeleton from "@/shared/components/table/table-skeleton";

export const metadata: Metadata = {
    title: "Plans",
    description: "Create and manage your gym's membership plans.",
    robots: {
        index: false,
        follow: false,
    },
};

const PLANS_STATS_CONFIG = {
    totalPlans: {
        icon: <Folder size={14} />,
        description: "Total number of plans",
    },
    monthlyRevenue: {
        icon: <Banknote size={14} />,
        description: "Monthly revenue generated",
    },
    activePlansCount: {
        icon: <Activity size={14} />,
        description: "Currently active plans",
    },
};

const Plans = async () => {
    const plansPromise = getPlansDashboardData();

    return (
        <div className="space-y-5">
            <Suspense fallback={<StatsCardsSkeleton length={3} />}>
                <StatsSection
                    config={PLANS_STATS_CONFIG}
                    promise={plansPromise}
                    gridCount={3}
                />
            </Suspense>
            <Suspense fallback={<TableSkeleton />}>
                <PlansTable
                    columns={PLANS_TABLE_COLUMNS}
                    data={plansPromise.then((res) => res.plans)}
                />
            </Suspense>
        </div>
    );
};

export default Plans;

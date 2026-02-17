import type { Metadata } from "next";
import PlansTable from "@/features/plans/components/plans-table";
import { PLANS_TABLE_COLUMNS } from "@/features/plans/components/plans-table-columns";
import { getPlansDashboardData } from "@/features/plans/queries";
import React, { Suspense } from "react";
import { Activity, Banknote, CreditCard, Folder } from "lucide-react";
import { StatsConfigItem } from "../members/page";
import { StatsSection } from "@/shared/components/stats/stats-section";
import TableSkeleton from "@/shared/components/table/table-skeleton";

export const metadata: Metadata = {
    title: "PLANS",
    description: "Manage your plans",
    robots: {
        index: false,
        follow: false,
    },
};

const PLANS_STATS_CONFIG = [
    {
        title: "Total Plans",
        icon: <Folder size={20} />,
        description: "Total number of plans",
        statKey: "totalPlans",
    },
    {
        title: "Monthly Revenue",
        icon: <Banknote size={20} />,
        description: "Monthly revenue generated",
        statKey: "monthlyRevenue",
    },
    {
        title: "Active Plans",
        icon: <Activity size={20} />,
        description: "Currently active plans",
        statKey: "activePlansCount",
    },
] as const satisfies StatsConfigItem[];

const Plans = async () => {
    const plansPromise = getPlansDashboardData();

    return (
        <div className="space-y-5">
            <StatsSection promise={plansPromise} items={PLANS_STATS_CONFIG} />
            <Suspense fallback={<TableSkeleton />}>
                <PlansTable
                    columns={PLANS_TABLE_COLUMNS}
                    plansPromise={plansPromise}
                />
            </Suspense>
        </div>
    );
};

export default Plans;

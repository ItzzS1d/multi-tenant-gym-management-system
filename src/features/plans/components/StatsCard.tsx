import React, { use } from "react";
import { getPlansDashboardData } from "../queries";
import StatsCard from "@/features/members/components/attendance/stats-card";
import { DollarSign, Folder } from "lucide-react";

type StatsCardProps = ReturnType<typeof getPlansDashboardData>;

const StatsCards = ({ plansPromise }: { plansPromise: StatsCardProps }) => {
    const statsPromiseResolved = use(plansPromise);
    const stats = statsPromiseResolved.stats;
    return (
        <div className="grid grid-rows-1 md:grid-cols-3 gap-3">
            <StatsCard
                icon={<Folder />}
                title="Total Plans"
                value={stats.totalPlans || 0}
                description="Total Plans "
            />
            <StatsCard
                icon={<DollarSign />}
                title="Monthly Revenue"
                value={stats.monthlyRevenue || 0}
                description="monthly revenue"
            />
            <StatsCard
                icon={<Folder />}
                title="Expiring Soon"
                value={stats.churnRiskCount || 0}
                description="Total members plan expiring soon"
            />
        </div>
    );
};

export default StatsCards;

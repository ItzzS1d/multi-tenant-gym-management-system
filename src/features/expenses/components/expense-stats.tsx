"use client";
import StatsCard from "@/shared/components/stats-card";
import { getExpensesStats } from "../expenses-queries";
import { use } from "react";
import { Banknote } from "lucide-react";
import { formatCurrency } from "@/shared/lib/utils";


const ExpnesesStats = ({
    statsPromise,
}: {
    statsPromise: ReturnType<typeof getExpensesStats>;
}) => {
    const stats = use(statsPromise);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
                title={"Revenue "}
                icon={<Banknote />}
                description={"This is the  revenue of current month"}
                value={formatCurrency(stats.revenue)}
            />
            <StatsCard
                title={"Expenses "}
                icon={<Banknote />}
                description={"This is the  expenses of current month"}
                value={formatCurrency(stats.expenses

                )}
            />
            <StatsCard
                title={"Profit "}
                icon={<Banknote />}
                description={"This is the  Profit of current month"}
                value={formatCurrency(stats.profit)}
            />
            <StatsCard
                title={"Top Spent Category"}
                icon={<Banknote />}
                description={`total amount spent  ${formatCurrency(stats.topCategoryAmount)}`}
                value={stats?.topCategory}
            />
        </div>
    );
};

export default ExpnesesStats;

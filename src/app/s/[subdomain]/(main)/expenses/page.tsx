import { EXPENSE_TABLE_COLUMNS } from "@/features/expenses/components/tables/expenses-table-columns";
import {
    getExpenesList,
    getExpenseCategoryPieData,
    getExpensesStats,
    getFixedVsVariableChartData,
    getMonthlyTrendChartData,
    getRevenueVsExpensesChartData,
    getUpcomingRecurringExpenses,
} from "@/features/expenses/expenses-queries";
import TableSkeleton from "@/shared/components/table/table-skeleton";
import React, { Suspense } from "react";
import { StatsSection } from "@/shared/components/stats/stats-section";
import { StatsCardsSkeleton } from "@/shared/components/stats/stats-card-skeleton";
import MonthlyTrendLineChart from "@/features/expenses/components/charts/montly-trend-line-chart";
import ExpenseCategoryPieChart from "@/features/expenses/components/charts/expenses-pie-chart";
import FixedVsVariableBarChart from "@/features/expenses/components/charts/fixed-variable-chart";
import RevenueVsExpensesBarChart from "@/features/expenses/components/charts/revenue-expeneses-bar-chart";
import UpcomingBills from "@/features/expenses/components/upcoming-bills";
import { UpcomingBillsSkeleton } from "@/features/expenses/components/skeletons/upcoming-bills-skeleton";
import { ExpenseCategoryPieChartSkeleton } from "@/features/expenses/components/skeletons/expense-category-pie-chart-skeleton";
import { RevenueVsExpensesTrendSkeleton } from "@/features/expenses/components/skeletons/revenue-vs-expenses-trend-skeleton";
import { RevenueVsExpensesBarChartSkeleton } from "@/features/expenses/components/skeletons/revenue-vs-expenses-skeleton";
import { FixedVsVariableChartSkeleton } from "@/features/expenses/components/skeletons/fixed-vs-variable-skeleton";
import ExpensesTable from "@/features/expenses/components/tables/expenses-table";
import { Banknote, TrendingUp, PiggyBank, Tag } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Expenses",
    description: "Track and manage your gym's expenses and recurring bills.",
};

const EXPENSES_STATS_CONFIG = {
    revenue: {
        icon: <Banknote size={14} />,
        description: "Revenue of current month",
    },
    expenses: {
        icon: <TrendingUp size={14} />,
        description: "Expenses of current month",
    },
    profit: {
        icon: <PiggyBank size={14} />,
        description: "Profit of current month",
    },
    topCategory: {
        icon: <Tag size={14} />,
        description: "Top spent category",
    },
};

const Expenses = () => {
    const expensesListPromise = getExpenesList();
    const expensesStatsPromise = getExpensesStats();
    const monthlyTrendChartDataPromise = getMonthlyTrendChartData();
    const expenseCategoryPieDataPromise = getExpenseCategoryPieData();
    const fixedVsVariableChartPromise = getFixedVsVariableChartData();
    const revenueVsExpensesPromise = getRevenueVsExpensesChartData();
    const upcomingExpensesPromise = getUpcomingRecurringExpenses();

    return (
        <main className="space-y-3">
            <Suspense fallback={<StatsCardsSkeleton length={4} />}>
                <StatsSection
                    config={EXPENSES_STATS_CONFIG}
                    promise={expensesStatsPromise}
                    gridCount={4}
                />
            </Suspense>

            <Suspense fallback={<RevenueVsExpensesTrendSkeleton />}>
                <MonthlyTrendLineChart
                    monthlyTrendDataPromise={monthlyTrendChartDataPromise}
                />
            </Suspense>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Suspense fallback={<ExpenseCategoryPieChartSkeleton />}>
                    <ExpenseCategoryPieChart
                        expenseCategoryPieDataPromise={
                            expenseCategoryPieDataPromise
                        }
                    />
                </Suspense>

                <Suspense fallback={<RevenueVsExpensesBarChartSkeleton />}>
                    <RevenueVsExpensesBarChart
                        revenueVsExpensesPromise={revenueVsExpensesPromise}
                    />
                </Suspense>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Suspense fallback={<FixedVsVariableChartSkeleton />}>
                    <FixedVsVariableBarChart
                        fixedVsVariablePromise={fixedVsVariableChartPromise}
                    />
                </Suspense>

                <Suspense fallback={<UpcomingBillsSkeleton />}>
                    <UpcomingBills
                        upcomingExpensesPromise={upcomingExpensesPromise}
                    />
                </Suspense>
            </div>

            <Suspense fallback={<TableSkeleton />}>
                <ExpensesTable
                    columns={EXPENSE_TABLE_COLUMNS}
                    expensesPromise={expensesListPromise}
                />
            </Suspense>
        </main>
    );
};

export default Expenses;

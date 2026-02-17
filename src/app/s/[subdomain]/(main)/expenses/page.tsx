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
import StatsCardSkeleton from "@/shared/components/stats-card-skeleton";
import ExpnesesStats from "@/features/expenses/components/expense-stats";
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
            <Suspense
                fallback={
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <StatsCardSkeleton key={i} />
                        ))}
                    </div>
                }
            >
                <ExpnesesStats statsPromise={expensesStatsPromise} />
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

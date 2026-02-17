"use client";

import { use, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { formatCurrency } from "@/shared/lib/utils";
import { getRevenueVsExpensesChartData } from "../../expenses-queries";

const RevenueVsExpensesBarChart = ({
    revenueVsExpensesPromise,
}: {
    revenueVsExpensesPromise: ReturnType<typeof getRevenueVsExpensesChartData>;
}) => {
    const rawData = use(revenueVsExpensesPromise) || [];

    const chartData = useMemo(() => {
        const revenue =
            rawData.find((d) => d.type.toLowerCase() === "revenue")?.amount ||
            0;
        const expenses =
            rawData.find((d) => d.type.toLowerCase() === "expenses")?.amount ||
            0;

        return [
            { name: "Revenue", amount: revenue, color: "#4ADE80" },
            { name: "Expenses", amount: expenses, color: "#ef4444" },
        ];
    }, [rawData]);

    // Calculate profit margin for the footer
    const profitMargin = useMemo(() => {
        const rev = chartData[0].amount;
        const exp = chartData[1].amount;
        if (rev === 0) return 0;
        return (((rev - exp) / rev) * 100).toFixed(1);
    }, [chartData]);

    return (
        <div className=" p-6 rounded-xl border border-[#86efac]/10 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white font-lexend mb-6">
                This Month Comparison
            </h3>

            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 10,
                                fontWeight: 700,
                                fill: "#94a3b8",
                                textAnchor: "middle",
                            }}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow-lg">
                                            {formatCurrency(
                                                payload[0].value as number,
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="amount"
                            radius={[8, 8, 0, 0]}
                            barSize={80}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm text-slate-500">
                    Net Profit Margin
                </span>
                <span
                    className={`text-sm font-bold ${Number(profitMargin) >= 0 ? "text-emerald-600" : "text-rose-600"}`}
                >
                    {Number(profitMargin) >= 0 ? "+" : ""}
                    {profitMargin}%
                </span>
            </div>
        </div>
    );
};

export default RevenueVsExpensesBarChart;

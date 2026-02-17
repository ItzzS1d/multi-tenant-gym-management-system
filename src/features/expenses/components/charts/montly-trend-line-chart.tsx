"use client";

import { getMonthlyTrendChartData } from "@/features/expenses/expenses-queries";
import { formatCurrency } from "@/shared/lib/utils";
import { use } from "react";
import {
    CartesianGrid,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    ResponsiveContainer,
} from "recharts";

const MonthlyTrendLineChart = ({
    monthlyTrendDataPromise,
}: {
    monthlyTrendDataPromise: ReturnType<typeof getMonthlyTrendChartData>;
}) => {
    const monthlyTrendData = use(monthlyTrendDataPromise);

    return (
        <section className=" p-6 rounded-xl border border-emerald-500/10 shadow-sm w-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white font-lexend text-lg">
                        Revenue vs Expenses Trend
                    </h3>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium  mt-1">
                        Performance over last 6 months
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="text-xs font-medium text-slate-500">
                            Revenue
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                        <span className="text-xs font-medium text-slate-500">
                            Expenses
                        </span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={monthlyTrendData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid
                            stroke="#f1f5f9"
                            vertical={false}
                            strokeWidth={1}
                        />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fontSize: 10,
                                fill: "#94a3b8",
                                fontWeight: 700,
                                textAnchor: "middle",
                            }}
                            dy={10}
                        />

                        <YAxis hide domain={["auto", "auto"]} />

                        <Tooltip
                            cursor={{ stroke: "#f1f5f9", strokeWidth: 2 }}
                            formatter={(value: number | undefined) => [
                                formatCurrency(value || 0),
                                "",
                            ]}
                            contentStyle={{
                                borderRadius: "10px",
                                border: "none",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                                fontSize: "12px",
                                fontWeight: "600",
                            }}
                        />

                        {/* Revenue Line - Salary Green */}
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#4ADE80"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#4ADE80", strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />

                        {/* Expenses Line - Rose 500 */}
                        <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default MonthlyTrendLineChart;

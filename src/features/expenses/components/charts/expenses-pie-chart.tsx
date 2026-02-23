"use client";

import { use, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/shared/lib/utils";
import { getExpenseCategoryPieData } from "../../expenses-queries";

const ExpensePieChart = ({
    expenseCategoryPieDataPromise,
}: {
    expenseCategoryPieDataPromise: ReturnType<typeof getExpenseCategoryPieData>;
}) => {
    const rawData = use(expenseCategoryPieDataPromise) || [];

    const categoryColorMap: Record<string, string> = {
        SALARY: "#4ADE80",
        RENT: "#6366F1",
        MARKETING: "#F59E0B",
        UTILITIES: "#0EA5E9",
        EQUIPMENT: "#8B5CF6",
        MAINTENANCE: "#EF4444",
        SOFTWARE: "#14B8A6",
        SUPPLIES: "#F97316",
        MISC: "#CBD5E1",
    };

    const processedData = useMemo(() => {
        const total = rawData.reduce((acc, curr) => acc + curr.amount, 0);
        return rawData.map((item) => ({
            name: item.category,
            value: item.amount,
            percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
            color: categoryColorMap[item.category.toUpperCase()] || "#CBD5E1",
        }));
    }, [rawData]);

    const totalSpend = useMemo(
        () => rawData.reduce((acc, curr) => acc + curr.amount, 0),
        [rawData],
    );

    return (
        <div className=" p-6 rounded-xl border border-primary/10 shadow-sm">
            <h3 className="font-bold  dark:text-white font-lexend mb-6">
                Expense Breakdown
            </h3>

            {/* CENTER WRAPPER — THIS FIXES THE BIG EMPTY SPACE */}
            <div className="max-w-md mx-auto flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-8">
                {/* DONUT */}
                <div className="relative w-48 h-48 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            {/* base ring */}
                            <Pie
                                data={[{ value: 1 }]}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={68}
                                outerRadius={80}
                                fill="#808080"
                                stroke="none"
                                isAnimationActive={false}
                            />

                            {/* data ring */}
                            <Pie
                                data={processedData}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={68}
                                outerRadius={80}
                                startAngle={90}
                                endAngle={450}
                                stroke="none"
                            >
                                {processedData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>

                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className=" text-white text-[10px] py-1 px-2 rounded">
                                                {payload[0].name}:{" "}
                                                {formatCurrency(
                                                    payload[0].value as number,
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold  dark:text-white">
                            {formatCurrency(totalSpend).split(".")[0]}
                        </span>
                        <span className="text-[10px]  font-bold uppercase tracking-tight">
                            Total Spend
                        </span>
                    </div>
                </div>

                {/* LEGEND */}
                <div className="space-y-3 w-full md:w-auto">
                    {processedData.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between md:justify-start md:gap-10"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-xs  ">
                                    {item.name.toUpperCase()}
                                </span>
                            </div>
                            <span className="text-xs font-bold ">
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExpensePieChart;

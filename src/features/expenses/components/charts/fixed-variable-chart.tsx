"use client";

import { use, useMemo } from "react";
import { getFixedVsVariableChartData } from "../../expenses-queries";
import { Banknote } from "lucide-react";

const FixedVsVariableChart = ({
    fixedVsVariablePromise,
}: {
    fixedVsVariablePromise: ReturnType<typeof getFixedVsVariableChartData>;
}) => {
    const rawData = use(fixedVsVariablePromise) || [];

    const processedData = (() => {
        let fixed = 0;
        let variable = 0;

        for (const item of rawData) {
            const type = item.type.toLowerCase();
            if (type === "fixed") fixed += item.amount;
            if (type === "variable") variable += item.amount;
        }

        const total = fixed + variable;

        return {
            fixed,
            variable,
            fixedPerc: total ? Math.round((fixed / total) * 100) : 0,
            variablePerc: total ? Math.round((variable / total) * 100) : 0,
        };
    })();

    return (
        <div className=" p-6 rounded-xl border border-[#86efac]/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white font-lexend">
                    Fixed vs Variable Costs
                </h3>
                <div className="p-2 bg-[#86efac]/10 rounded-lg">
                    <Banknote className="text-[#10b981] text-xl" />
                </div>
            </div>

            <div className="space-y-6">
                {/* Fixed Costs Bar */}
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500 font-medium">
                            Fixed (Rent, Salaries, Software)
                        </span>
                        <span className="text-slate-900   font-bold">
                            {processedData.fixedPerc}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${processedData.fixedPerc}%` }}
                        ></div>
                    </div>
                </div>

                {/* Variable Costs Bar */}
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-slate-500 font-medium">
                            Variable (Marketing, Utilities, Stock)
                        </span>
                        <span className="text-slate-900 dark:text-white font-bold">
                            {processedData.variablePerc}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200  rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#6366f1] transition-all duration-500"
                            style={{
                                width: `${processedData.variablePerc}%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FixedVsVariableChart;

import { Skeleton } from "@/shared/components/ui/skeleton";
import { Banknote } from "lucide-react";

export const FixedVsVariableChartSkeleton = () => {
    return (
        <div className="p-6 rounded-xl border border-primary/10 shadow-sm ">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white font-lexend">
                    Fixed vs Variable Costs
                </h3>
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Banknote className="text-primary text-xl" />
                </div>
            </div>

            <div className="space-y-6">
                {/* Fixed Costs Bar */}
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="w-full h-3 rounded-full" />
                </div>

                {/* Variable Costs Bar */}
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="w-full h-3 rounded-full" />
                </div>

                <Skeleton className="h-3 w-full max-w-[300px]" />
            </div>
        </div>
    );
};

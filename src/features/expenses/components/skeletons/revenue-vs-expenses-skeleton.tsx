import { Skeleton } from "@/shared/components/ui/skeleton";

export const RevenueVsExpensesBarChartSkeleton = () => {
    return (
        <div className=" p-6 rounded-xl border border-primary/10 shadow-sm ">
            <h3 className="font-bold text-slate-900 dark:text-white font-lexend mb-6">
                This Month Comparison
            </h3>

            <div className="h-48 w-full flex items-end justify-around px-4 gap-8">
                {/* Revenue Bar */}
                <div className="w-full h-full flex flex-col justify-end items-center gap-2">
                    <Skeleton className="w-20 h-[80%] rounded-t-lg" />
                    <Skeleton className="h-3 w-12" />
                </div>
                {/* Expenses Bar */}
                <div className="w-full h-full flex flex-col justify-end items-center gap-2">
                    <Skeleton className="w-20 h-[50%] rounded-t-lg" />
                    <Skeleton className="h-3 w-12" />
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                <span className="text-sm text-slate-500">
                    Net Profit Margin
                </span>
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    );
};

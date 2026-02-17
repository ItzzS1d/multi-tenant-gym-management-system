import { Skeleton } from "@/shared/components/ui/skeleton";

export const ExpenseCategoryPieChartSkeleton = () => (
    <div className=" p-6 rounded-xl border border-primary/10 shadow-sm ">
        <h3 className="font-bold text-slate-900 dark:text-white font-lexend mb-6">
            Expense Breakdown
        </h3>
        <div className="max-w-md mx-auto flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-8">
            {/* Donut Circle */}
            <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
                <Skeleton className="w-full h-full rounded-full opacity-20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 w-full md:w-auto grow max-w-[200px]">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="flex justify-between items-center gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-3 h-3 rounded-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-3 w-8" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

import { Skeleton } from "@/shared/components/ui/skeleton";

export const RevenueVsExpensesTrendSkeleton = () => {
    return (
        <section className="p-6 rounded-xl border border-primary/10 shadow-sm w-full bg-white dark:bg-slate-900/50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white font-lexend text-lg">
                        Revenue vs Expenses Trend
                    </h3>
                    <Skeleton className="h-3 w-48 mt-1" />
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full relative">
                {/* Y-axis background lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-full border-b border-dashed border-slate-100 dark:border-slate-800" />
                    ))}
                </div>

                {/* Simulated Line Chart using SVG */}
                <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Revenue Line path */}
                    <path
                        d="M0 60 C 20 50, 40 70, 60 40 S 80 20, 100 30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-slate-200 dark:text-slate-700 opacity-50"
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Expenses Line path */}
                    <path
                        d="M0 80 C 20 75, 40 85, 60 60 S 80 50, 100 65"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-slate-200 dark:text-slate-700 opacity-50"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute bottom-2 left-0 w-full flex justify-between px-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-2 w-8" />
                    ))}
                </div>
            </div>
        </section>
    );
};

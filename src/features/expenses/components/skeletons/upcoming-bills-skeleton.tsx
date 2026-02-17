import { Skeleton } from "@/shared/components/ui/skeleton";

export const UpcomingBillsSkeleton = () => (
    <div className="p-6 rounded-xl border border-primary/10 shadow-sm ">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-semibold font-lexend">
                    Upcoming Bills
                </h3>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Total Due</p>
                <Skeleton className="h-7 w-24 ml-auto" />
            </div>
        </div>
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded" />
                        <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-2 w-20" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-12" />
                </div>
            ))}
        </div>
    </div>
);

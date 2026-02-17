import { Skeleton } from "./ui/skeleton";
export default function StatsCardSkeleton() {
    return (
        <div>
            <div className="bg-surface-light dark:bg-surface-dark p-3 px-4 rounded-xl shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="w-25 h-8" />
                    <Skeleton className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="w-20 h-8" />
                    <Skeleton className="w-90 h-8" />
                </div>
            </div>
        </div>
    );
}

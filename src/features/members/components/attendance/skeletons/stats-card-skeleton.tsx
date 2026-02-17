import { Skeleton } from "@/shared/components/ui/skeleton";
import { BarChart } from "lucide-react";

export default function StatsCardSkeleton() {
    return (
        <div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                        Total Visits
                    </p>
                    <span className="material-symbols-outlined text-primary">
                        <BarChart />
                    </span>
                </div>
                <Skeleton className="w-20 h-10" />
                <Skeleton className="w-20 h-10" />
            </div>
        </div>
    );
}

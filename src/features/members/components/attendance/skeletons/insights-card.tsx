import { Skeleton } from "@/shared/components/ui/skeleton";
import { Watch } from "lucide-react";

export default function AttendanceInsightsCardSkeleton() {
    return (
        <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
            <h3 className="text-sm font-bold mb-3">Attendance Insights</h3>

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600 text-sm">
                            <Watch />
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-bold">Peak Visit Time</p>
                        <Skeleton className="w-20 h-5" />
                    </div>
                </div>

                {/*<div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600 text-sm">
                            local_fire_department
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-bold">Active Streak</p>
                        <p className="text-[11px] text-text-sub-light">
                            4 consecutive days active
                        </p>
                    </div>
                </div>*/}
            </div>
        </div>
    );
}

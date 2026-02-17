import { Skeleton } from "@/shared/components/ui/skeleton";

export default function RecentCheckInsSkeleton() {
    return (
        <div className="bg-white lg:col-span-1 rounded-xl p-5 shadow-sm border border-[#e7f3eb]">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-5 w-40" />
            </div>

            {/* Timeline */}
            <div className="relative pl-2 border-l-2 border-[#e7f3eb] space-y-8">
                {/* Item */}
                <div className="relative pl-4">
                    <div className="absolute -left-[13px] top-1">
                        <Skeleton className="h-3 w-3 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-40" />
                </div>

                <div className="relative pl-4">
                    <div className="absolute -left-[13px] top-1">
                        <Skeleton className="h-3 w-3 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-36 mb-2" />
                    <Skeleton className="h-3 w-44" />
                </div>

                <div className="relative pl-4">
                    <div className="absolute -left-[13px] top-1">
                        <Skeleton className="h-3 w-3 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-3 w-36" />
                </div>
            </div>
        </div>
    );
}

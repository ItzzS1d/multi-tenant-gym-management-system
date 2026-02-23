import { Skeleton } from "@/shared/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="flex flex-col gap-8 pb-10 max-w-full">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <Skeleton
                                    key={i}
                                    className="h-64 w-full rounded-xl"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                    </div>

                    <Skeleton className="h-40 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}

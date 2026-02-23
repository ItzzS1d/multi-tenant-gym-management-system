import { Skeleton } from "@/shared/components/ui/skeleton";

const RecordsClenderSkeleton = () => {
    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <Skeleton className="h-10 w-full sm:w-72 rounded-md" />

                <div className="flex gap-2 items-center">
                    <Skeleton className="h-10 w-28 rounded-md" />
                    <Skeleton className="h-10 w-36 rounded-md" />
                </div>
            </div>

            <div className="flex flex-wrap gap-5 items-center justify-center sm:justify-start mb-4 border rounded-xl p-4">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-xl">
                <Skeleton className="p-4 rounded-full h-16 w-16 mb-4" />
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
    );
};

export default RecordsClenderSkeleton;

import { Skeleton } from "@/shared/components/ui/skeleton";

const ProfileHeaderCardSkeleton = () => {
    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
                    {/* Avatar Skeleton */}
                    <div className="relative">
                        <Skeleton className="rounded-full h-24 w-24 md:h-28 md:w-28" />
                        <div className="absolute bottom-1 right-1">
                            <Skeleton className="rounded-full h-6 w-6" />
                        </div>
                    </div>

                    {/* Profile Info Skeleton */}
                    <div className="flex flex-col gap-1.5 pt-1">
                        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                            {/* Name */}
                            <Skeleton className="h-8 w-40 md:w-48 " />
                            {/* Badge */}
                            <Skeleton className="h-5 w-28 rounded-full" />
                        </div>
                        {/* Premium Plan */}
                        <Skeleton className="h-5 w-32 mt-1" />
                        {/* Join Date and Last Visit */}
                        <div className="flex items-center gap-4 mt-1 justify-center sm:justify-start">
                            <Skeleton className="h-6 w-32 rounded" />
                            <Skeleton className="h-6 w-36 rounded" />
                        </div>
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex gap-3 w-full md:w-auto">
                    <Skeleton className="flex-1 md:flex-none h-10 w-32 rounded-lg" />
                    <Skeleton className="flex-1 md:flex-none h-10 w-28 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default ProfileHeaderCardSkeleton;

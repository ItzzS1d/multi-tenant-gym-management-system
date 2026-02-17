import { Skeleton } from "@/shared/components/ui/skeleton";
import { Contact, User } from "lucide-react";

const ContactInfoSkeleton = () => {
    return (
        <>
            {/* Contact Information Skeleton */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text-main-light dark:text-text-main-dark flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                            <Contact />
                        </span>
                        Contact Information
                    </h3>
                    <Skeleton className="h-8 w-16 bg-[#e7f3eb] dark:bg-[#2a4034]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                        <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide">
                            EMAIL ADDRESS
                        </p>
                        <Skeleton className="h-5 w-52 mt-1 bg-[#e7f3eb] dark:bg-[#2a4034]" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide">
                            PHONE NUMBER
                        </p>
                        <Skeleton className="h-5 w-40 mt-1 bg-[#e7f3eb] dark:bg-[#2a4034]" />
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide">
                            PHYSICAL ADDRESS
                        </p>
                        <Skeleton className="h-5 w-full max-w-md mt-1 bg-[#e7f3eb] dark:bg-[#2a4034]" />
                    </div>
                </div>
            </div>

            {/* Personal Details Skeleton */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text-main-light dark:text-text-main-dark flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">
                            <User />
                        </span>
                        Personal Details
                    </h3>
                    <Skeleton className="h-8 w-16 bg-[#e7f3eb] dark:bg-[#2a4034]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                        <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide">
                            DATE OF BIRTH
                        </p>
                        <Skeleton className="h-5 w-52 mt-1 bg-[#e7f3eb] dark:bg-[#2a4034]" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide">
                            GENDER
                        </p>
                        <Skeleton className="h-5 w-40 mt-1 bg-[#e7f3eb] dark:bg-[#2a4034]" />
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark uppercase tracking-wide">
                            EMERGENCY CONTACT
                        </p>
                        <Skeleton className="h-5 w-full max-w-md mt-1 bg-[#e7f3eb] dark:bg-[#2a4034]" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactInfoSkeleton;

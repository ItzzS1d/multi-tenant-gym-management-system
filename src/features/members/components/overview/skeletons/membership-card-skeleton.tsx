import { Skeleton } from "@/shared/components/ui/skeleton";
import { CreditCard } from "lucide-react";

export default function MembershipCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e7f3eb]">
            {/* Title */}
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className=" text-primary">
                    <CreditCard />
                </span>
                Membership
            </h3>

            {/* Membership gradient card */}
            <div className="bg-gradient-to-br from-[#102216] to-[#1c2e24] p-4 rounded-xl mb-4 space-y-4">
                <p className="text-xs text-white/70 uppercase mb-1">
                    Current Plan
                </p>
                <Skeleton className="h-6 w-40 bg-white/30" />

                <div className="flex justify-between items-end">
                    <Skeleton className="h-7 w-24 bg-white/30" />
                    <Skeleton className="h-5 w-16 bg-white/30 rounded-md" />
                </div>
            </div>

            {/* Details rows */}
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span>Status</span>
                    <Skeleton className="h-4 w-16" />
                </div>

                <div className="flex justify-between">
                    <span>Next Billing</span>
                    <Skeleton className="h-4 w-20" />
                </div>

                <div className="flex justify-between">
                    <span>Method</span>
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Button */}
            <Skeleton className="h-10 w-full mt-6 rounded-lg" />
        </div>
    );
}

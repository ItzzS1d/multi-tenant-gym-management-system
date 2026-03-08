import { CreditCard } from "lucide-react";
import React, { use } from "react";
import { getMemberOverViewDetails } from "../../new/queries";
import { formatCurrency, formatDate } from "@/shared/lib/utils";

export default function MembershipCard({
    memberOverviewDetailsPromise,
}: {
    memberOverviewDetailsPromise: ReturnType<typeof getMemberOverViewDetails>;
}) {
    const memberDetails = use(memberOverviewDetailsPromise);
    const latestPlan = memberDetails?.memberPlans?.[0];
    const isActive = latestPlan?.status === "ACTIVE";
    const statusLabel =
        latestPlan?.status === "EXPIRED" ? "Expired On" : "Next Billing";

    return (
        <section className="bg-white lg:col-span-1 rounded-xl p-5 shadow-sm border border-[#e7f3eb]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className=" text-primary">
                    <CreditCard />
                </span>
                Membership
            </h3>

            {/* Card */}
            <div className="bg-linear-to-br from-[#102216] to-[#1c2e24] p-4 rounded-xl text-white mb-4 relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] h-24 w-24 bg-primary/20 rounded-full blur-xl"></div>

                <p className="text-xs text-white/70 uppercase mb-1">
                    {isActive ? "Current Plan" : "Last Plan"}
                </p>
                <p className="text-xl font-bold mb-4">
                    {latestPlan.plan.name || "No Plan History"}
                </p>

                <div className="flex justify-between items-end">
                    <p className="text-2xl font-bold text-primary">
                        {formatCurrency(latestPlan.plan.price)}{" "}
                        <span className="text-sm text-white/70">/mo</span>
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm pb-2 border-b border-[#e7f3eb]">
                    <span className="font-medium text-text-sub-light">Status</span>
                    <span
                        className={`font-semibold ${isActive
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-red-500"
                            }`}
                    >
                        {latestPlan?.status || "INACTIVE"}
                    </span>
                </div>

                <div className="flex justify-between text-sm pb-2 border-b border-[#e7f3eb]">
                    <span className="font-medium text-text-sub-light">
                        {statusLabel}
                    </span>
                    <span className="font-semibold text-text-main-light dark:text-text-main-dark">
                        {
                            formatDate(latestPlan.endDate)
                        }
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="font-medium text-text-sub-light">Method</span>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-main-light dark:text-text-main-dark">
                            {latestPlan.payments[0].method}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { CreditCard } from "lucide-react";
import React, { use } from "react";
import { getMemberOverViewDetails } from "../../new/queries";
import { formatCurrency } from "@/shared/lib/utils";

export default function MembershipCard({
    memberOverviewDetailsPromise,
}: {
    memberOverviewDetailsPromise: ReturnType<typeof getMemberOverViewDetails>;
}) {
    const memberDetails = use(memberOverviewDetailsPromise);
    return (
        <section className="bg-white lg:col-span-1 rounded-xl p-5 shadow-sm border border-[#e7f3eb]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className=" text-primary">
                    <CreditCard />
                </span>
                Membership
            </h3>

            {/* Card */}
            <div className="bg-gradient-to-br from-[#102216] to-[#1c2e24] p-4 rounded-xl text-white mb-4 relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] h-24 w-24 bg-primary/20 rounded-full blur-xl"></div>

                <p className="text-xs text-white/70 uppercase mb-1">
                    Current Plan
                </p>
                <p className="text-xl font-bold mb-4">
                    {memberDetails?.memberPlans?.[0]?.plan?.name || "No Active Plan"}
                </p>

                <div className="flex justify-between items-end">
                    <p className="text-2xl font-bold text-primary">
                        {formatCurrency(
                            memberDetails?.memberPlans?.[0]?.plan?.price || 0
                        )}{" "}
                        <span className="text-sm text-white/70">/mo</span>
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm pb-2 border-b border-[#e7f3eb]">
                    <span>Status</span>
                    <span
                        className={`font-medium ${memberDetails?.memberPlans?.[0]?.status === "ACTIVE"
                            ? "text-emerald-600"
                            : "text-red-500"
                            }`}
                    >
                        {memberDetails?.memberPlans?.[0]?.status || "INACTIVE"}
                    </span>
                </div>

                <div className="flex justify-between text-sm pb-2 border-b border-[#e7f3eb]">
                    <span>Next Billing</span>
                    <span className="font-medium">
                        {memberDetails?.memberPlans?.[0]?.endDate
                            ? new Date(
                                memberDetails.memberPlans[0].endDate
                            ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : "N/A"}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span>Method</span>
                    <div className="flex items-center gap-2">
                        {/*   <span className=" text-[16px]">
                            {memberDetails?.memberPlans?.[0]?.payments?.[0]
                                ?.method === "CASH" ? (
                                "payments"
                            ) : (
                                <CreditCard size={16} />
                            )}
                        </span> */}
                        <span className="font-medium">
                            {memberDetails?.memberPlans?.[0]?.payments?.[0]
                                ?.method || "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            <button className="w-full mt-5 py-2 rounded-lg border border-[#e7f3eb] text-sm font-medium hover:bg-[#f8fcf9]">
                Manage Billing
            </button>
        </section>
    );
}

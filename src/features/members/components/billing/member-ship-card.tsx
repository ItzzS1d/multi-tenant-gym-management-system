import { use } from "react";
import { getMemberActivePlanDetails } from "../../new/queries";
import { CreditCard } from "lucide-react";
import { formatDate } from "@/shared/lib/utils";
import EmptyMembershipState from "./empty-states/membership-details-empty-state";

const MemberShipCardDetails = ({
    memberActivePlan,
}: {
    memberActivePlan: ReturnType<typeof getMemberActivePlanDetails>;
}) => {
    const activePlan = use(memberActivePlan);

    return (
        <section className="items-start">
            {!activePlan ? (
                <EmptyMembershipState />
            ) : (
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                        <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark mb-4 flex items-center gap-2">
                            <span className="text-primary">
                                <CreditCard />
                            </span>
                            Membership Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium text-text-sub-light uppercase tracking-wider">
                                    Plan Name
                                </p>
                                <p className="text-sm font-bold">
                                    {activePlan.plan.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-medium text-text-sub-light uppercase tracking-wider">
                                        Start Date
                                    </p>
                                    <p className="text-sm font-bold">
                                        {formatDate(activePlan.startDate)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-text-sub-light uppercase tracking-wider">
                                        End Date
                                    </p>
                                    <p className="text-sm font-bold">
                                        {formatDate(activePlan.endDate)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-text-sub-light uppercase tracking-wider">
                                    Status
                                </p>
                                <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                    {activePlan.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default MemberShipCardDetails;

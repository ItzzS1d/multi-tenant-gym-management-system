import { Suspense } from "react";
import MemberShipCardDetails from "./member-ship-card";
import PaymentHistoryTable from "./table/payment-history-table";
import { PAYMENT_HISTORY_COLUMS } from "./table/payment-history-columns";
import { getMemberActivePlanDetails } from "../../new/queries";
import { getMemberPaymentHistoryDetails } from "./billing-queries";
import { StatsSection } from "@/shared/components/stats/stats-section";
import { CalendarIcon, IndianRupee, Receipt } from "lucide-react";

const BILLING_STATS_CONFIG = {
    totalRevenue: {
        title: "Total Revenue",
        icon: <IndianRupee size={14} />,
        description: "Total lifetime collections",
    },
    nextDue: {
        title: "Next Due Date",
        icon: <CalendarIcon size={14} />,
        description: "Membership expiry date",
    },
    lastPayment: {
        title: "Last Payment",
        icon: <Receipt size={14} />,
        description: "Last transaction amount",
    },
};

import { StatsCardsSkeleton } from "@/shared/components/stats/stats-card-skeleton";
import MembershipCardSkeleton from "../overview/skeletons/membership-card-skeleton";
import PaymentHistoryTableSkeleton from "./skeletons/payment-history-table-skeleton";

const BillingTab = ({ memberId }: { memberId: string }) => {
    const memberActivePlanPromise = getMemberActivePlanDetails(memberId);
    const paymentHistoryPromise = getMemberPaymentHistoryDetails(memberId);

    return (
        <section className="space-y-5">
            <Suspense fallback={<StatsCardsSkeleton length={3} />}>
                <StatsSection
                    config={BILLING_STATS_CONFIG}
                    promise={paymentHistoryPromise}
                    gridCount={3}
                />
            </Suspense>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Suspense fallback={<MembershipCardSkeleton />}>
                        <MemberShipCardDetails
                            memberActivePlan={memberActivePlanPromise}
                        />
                    </Suspense>
                </div>
                <div className="lg:col-span-2">
                    <Suspense fallback={<PaymentHistoryTableSkeleton />}>
                        <PaymentHistoryTable
                            columns={PAYMENT_HISTORY_COLUMS}
                            data={paymentHistoryPromise.then((d) => d.records)}
                        />
                    </Suspense>
                </div>
            </div>
        </section>
    );
};

export default BillingTab;

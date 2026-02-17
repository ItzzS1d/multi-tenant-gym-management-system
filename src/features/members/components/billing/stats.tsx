import { use } from "react";
import StatsCard from "../attendance/stats-card";
import {
    getMemberActivePlanDetails,
    getMemberPaymentHistoryDetails,
} from "../../new/queries";
import { CalendarIcon, IndianRupee, Receipt } from "lucide-react";
import { formatCurrency, formatDate } from "@/shared/lib/utils";

type BillingStatsProps = {
    memberActivePlanPromise: ReturnType<typeof getMemberActivePlanDetails>;
    paymentHistoryPromise: ReturnType<typeof getMemberPaymentHistoryDetails>;
};

const BillingStats = ({
    memberActivePlanPromise,
    paymentHistoryPromise,
}: BillingStatsProps) => {
    const activePlan = use(memberActivePlanPromise);
    const paymentHistory = use(paymentHistoryPromise);
    const totalRevenue = paymentHistory.reduce(
        (acc, payment) => acc + payment.amount,
        0,
    );
    const lastPayment = paymentHistory.length > 0 ? paymentHistory[0] : null;
    const nextDue = activePlan?.endDate ? new Date(activePlan.endDate) : null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <StatsCard
                title="Total Revenue"
                value={formatCurrency(totalRevenue)}
                description="Total lifetime collections"
                icon={<IndianRupee />}
            />

            <StatsCard
                title="Next Due Date"
                value={nextDue ? formatDate(nextDue) : "No Active Plan"}
                description={
                    nextDue ? "Membership expiry date" : "Renewal required"
                }
                icon={<CalendarIcon />}
            />
            <StatsCard
                title="Last Payment"
                value={lastPayment ? formatCurrency(lastPayment.amount) : "₹0"}
                description={
                    lastPayment
                        ? `Paid on
                        ${formatCurrency(lastPayment.amount)}`
                        : "No payment history"
                }
                icon={<Receipt />}
            />
        </div>
    );
};

export default BillingStats;

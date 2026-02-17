import { Suspense } from "react";
import MemberShipCardDetails from "./member-ship-card";
import PaymentHistoryTable from "./table/payment-history-table";
import { PAYMENT_HISTORY_COLUMS } from "./table/payment-history-columns";
import {
    getMemberActivePlanDetails,
    getMemberPaymentHistoryDetails,
} from "../../new/queries";
import BillingStats from "./stats";

const BillingTab = ({ memberId }: { memberId: string }) => {
    const memberActivePlanPromise = getMemberActivePlanDetails(memberId);
    const paymentHistoryPromisePromise =
        getMemberPaymentHistoryDetails(memberId);

    return (
        <section className="space-y-5">
            <Suspense>
                <BillingStats
                    memberActivePlanPromise={memberActivePlanPromise}
                    paymentHistoryPromise={paymentHistoryPromisePromise}
                />
            </Suspense>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Suspense>
                        <MemberShipCardDetails
                            memberActivePlan={memberActivePlanPromise}
                        />
                    </Suspense>
                </div>
                <div className="lg:col-span-2">
                    <Suspense>
                        <PaymentHistoryTable
                            columns={PAYMENT_HISTORY_COLUMS}
                            data={paymentHistoryPromisePromise}
                        />
                    </Suspense>
                </div>
            </div>
        </section>
    );
};

export default BillingTab;

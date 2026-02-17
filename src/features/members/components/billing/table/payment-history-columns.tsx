import { getMemberPaymentHistoryDetails } from "@/features/members/new/queries";
import { ColumnDef } from "@tanstack/react-table";

type PaymentHistoryColumnProps = Awaited<
    ReturnType<typeof getMemberPaymentHistoryDetails>
>[number];

export const PAYMENT_HISTORY_COLUMS: ColumnDef<PaymentHistoryColumnProps>[] = [
    {
        accessorKey: "date",
        header: "DATE",
    },
    {
        accessorKey: "amount",
        header: "AMOUNT",
    },
    {
        accessorKey: "method",
        header: "METHOD",
    },
    {
        accessorKey: "memberPlan",
        header: "PLAN",
    },
];

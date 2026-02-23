"use client";
import { ColumnDef } from "@tanstack/react-table";
import { getMemberPaymentHistoryDetails } from "../billing-queries";
import { formatDate } from "@/shared/lib/utils";

type PaymentHistoryRecord = Awaited<
    ReturnType<typeof getMemberPaymentHistoryDetails>
>["records"][number];

export const PAYMENT_HISTORY_COLUMS: ColumnDef<PaymentHistoryRecord>[] = [
    {
        accessorKey: "date",
        header: "DATE",
        cell: ({ getValue }) => {
            return formatDate(getValue() as Date);
        },
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

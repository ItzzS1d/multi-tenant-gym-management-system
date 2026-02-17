"use client";
import { ColumnDef } from "@tanstack/react-table";
import { getExpenesList } from "../expenses-queries";
import { formatCurrency, formatDate } from "@/shared/lib/utils";
import ExpensesActionCell from "./expense-action-cell";

export type ExpenseTableColumns = Awaited<
    ReturnType<typeof getExpenesList>
>[number];

export const EXPENSE_TABLE_COLUMNS: ColumnDef<ExpenseTableColumns>[] = [
    {
        accessorKey: "expenseDate",
        header: "DATE",
        cell({ getValue }) {
            return formatDate(getValue() as Date);
        },
    },

    {
        accessorFn: (row) => `${row.title} ${row.description}`,
        header: "NAME",
        cell({ row }) {
            return (
                <>
                    <h1>{row.original.title}</h1>

                    <span className="text-gray-500">
                        {row.original.description}
                    </span>
                </>
            );
        },
    },

    {
        accessorKey: "category",
        header: "CATEGORY",
    },
    {
        accessorKey: "amount",
        header: "AMOUNT",
        cell({ getValue }) {
            return `${formatCurrency(getValue() as number)}`;
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "PAYMENT METHOD",
    },
    {
        header: "ACTIONS",
        cell({ row }) {
            return <ExpensesActionCell defaultValues={row.original} />;
        },
    },
];

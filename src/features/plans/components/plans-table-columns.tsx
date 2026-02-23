"use client";
import { intervalToDuration } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { getPlansDashboardData } from "../queries";
import { formatCurrency } from "@/shared/lib/utils";
import PlanActionCell from "./plan-action-cell";

export type PlansDashboardData = Awaited<
    ReturnType<typeof getPlansDashboardData>
>["plans"][number];

export const PLANS_TABLE_COLUMNS: ColumnDef<PlansDashboardData>[] = [
    {
        accessorKey: "name",
        header: "PLAN NAME",
        cell: ({ row }) => {
            const isPopular = row.original.isPopular;
            return (
                <div className="space-x-2">
                    <span>{row.original.name}</span>
                    {isPopular && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-100 text-yellow-800 font-medium border border-yellow-200">
                            POPULAR
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: "PRICE",
        cell: ({ row }) => {
            const price = row.getValue("price") as number;
            return formatCurrency(price);
        },
    },

    {
        accessorKey: "durationInDays",
        header: "DURATION",
        cell: ({ row }) => {
            const durationInDays = row.original.durationInDays;

            if (durationInDays % 30 === 0) {
                const months = durationInDays / 30;
                return `${months} Month${months > 1 ? "s" : ""}`;
            }

            return `${durationInDays} Days`;
        },
    },
    {
        accessorKey: "members",
        header: "TOTAL MEMBERS ",
    },
    {
        accessorKey: "totalRevenue",
        header: "TOTAL REVENUE",
        cell: ({ row }) => {
            const totalRevenue = row.getValue("totalRevenue") as number;
            return formatCurrency(totalRevenue);
        },
    },
    {
        accessorKey: "description",
        header: "DESCRIPTION",
    },
    {
        accessorKey: "isActive",
        header: "STATUS",
        filterFn: "equals",
        cell: ({ row }) => {
            return (
                <PlanActionCell
                    type="status"
                    isActive={row.original.isActive}
                    id={row.original.id}
                />
            );
        },
    },
    {
        header: "ACTIONS",
        cell({ row }) {
            return <PlanActionCell defaultValues={row.original} type="edit" />;
        },
    },
];

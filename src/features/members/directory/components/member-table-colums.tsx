"use client";
import { ColumnDef } from "@tanstack/react-table";
import { getMemberList } from "../queries";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/shared/components/ui/avatar";
import { GENDER } from "../../../../../prisma/generated/prisma/enums";
import { formatCurrency, formatDate } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";

import { MemberTableActions } from "./member-table-actions";
import { Route } from "next";

export type MemberTableColumnProps = Awaited<
    ReturnType<typeof getMemberList>
>["records"][number];

export const MEMBERS_TABLE_COLUMNS: ColumnDef<MemberTableColumnProps>[] = [
    {
        id: "member",
        header: "MEMBER",
        enableGlobalFilter: true,
        accessorFn: ({ firstName, lastName, email }) =>
            `${firstName} ${lastName} ${email}`,
        cell({ row }) {
            const { email, firstName, lastName, id, image, gender } =
                row.original;
            const avatarSrc =
                gender === GENDER.MALE
                    ? "/mail-avatar.png"
                    : "/female-avatar.png";
            return (
                <Link
                    className="flex items-center gap-3"
                    href={`/members/${id}` as Route}
                >
                    <Avatar size="default">
                        <AvatarImage src={image ?? avatarSrc} />
                        <AvatarFallback>{`${firstName}${lastName}`}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <h3>
                            {firstName} {lastName}
                        </h3>
                        <p className="text-gray-500">{email}</p>
                    </div>
                </Link>
            );
        },
    },
    {
        accessorKey: "status",
        header: "STATUS",
        enableGlobalFilter: true,
        filterFn: (row, filterValue) => {
            if (!filterValue || filterValue === "all") return true;
            const status = row.original.status;
            const daysLeft = row.original.daysLeft;

            if (filterValue === "active") return status === "ACTIVE";
            if (filterValue === "expiring")
                return daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
            if (filterValue === "expired")
                return (
                    status === "EXPIRED" || (daysLeft !== null && daysLeft <= 0)
                );

            return true;
        },
        cell({ row }) {
            const { status, daysLeft } = row.original;
            const isExpiringSoon =
                daysLeft !== null && daysLeft <= 7 && daysLeft > 0;

            return (
                <div className="flex flex-col gap-1">
                    <Badge
                        variant={
                            status.toLowerCase() as VariantProps<
                                typeof Badge
                            >["variant"]
                        }
                    >
                        {status.substring(0, 1) +
                            status.substring(1).toLowerCase().replace("_", " ")}
                    </Badge>
                    {isExpiringSoon && (
                        <span className="text-[10px] text-orange-500 font-medium animate-pulse">
                            Expiring in {daysLeft} days
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "planName",
        header: "PLAN",
        enableGlobalFilter: true,
        cell({ row }) {
            const { planName, planPrice } = row.original;
            return (
                <div>
                    <h3>{planName}</h3>
                    <div className="flex items-center">
                        <span className="text-gray-500 text-sm">
                            {" "}
                            {formatCurrency(planPrice)}/mo{" "}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "planStartedDate",
        header: "JOINED DATE",
        cell({ getValue }) {
            return (
                <span className="text-gray-600 text-sm">
                    {formatDate(getValue() as Date)}
                </span>
            );
        },
    },
    {
        accessorKey: "planEndedDate",
        header: "END DATE",
        cell({ getValue }) {
            return (
                <span className="text-gray-600 text-sm">
                    {formatDate(getValue() as Date)}
                </span>
            );
        },
    },
    {
        accessorKey: "assignedTrainerName",
        header: "ASSIGNED TRAINER",
        enableGlobalFilter: true,
        cell({ getValue }) {
            return (
                <span className="text-gray-600 text-sm">
                    {getValue() as string}
                </span>
            );
        },
    },

    {
        id: "actions",
        enableGlobalFilter: false,
        header: "ACTIONS",
        cell({ row }) {
            return <MemberTableActions member={row.original} />;
        },
    },
];

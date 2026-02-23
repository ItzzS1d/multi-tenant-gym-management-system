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
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";

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
                    href={`/members/${id}`}
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
        cell({ row }) {
            const { status } = row.original;
            console.log(row.original);
            return (
                <Badge variant={status.toLowerCase()}>
                    {status.substring(0, 1) + status.substring(1).toLowerCase()}
                </Badge>
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
        accessorKey: "assignedTrainer",
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
        cell({ getValue }) {
            return <EllipsisVertical className="text-sm text-gray-500" />;
        },
    },
];

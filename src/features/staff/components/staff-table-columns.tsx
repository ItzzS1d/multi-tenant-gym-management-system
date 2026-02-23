"use client";
import { ColumnDef } from "@tanstack/react-table";
import { getStaffStatsAndTableData } from "../staff-queries";
import Link from "next/link";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { formatDate } from "@/shared/lib/utils";
import StaffActionCell from "./staff-action-cell";

export type StaffTableColumnProps = Awaited<
    ReturnType<typeof getStaffStatsAndTableData>
>["records"][number];

export const STAFF_TABLE_COLUMNS: ColumnDef<StaffTableColumnProps>[] = [
    {
        id: "staff",
        header: "STAFF NAME",
        cell: ({ row }) => {
            const { email, name, gymMemberId, image } = row.original;
            const avatarSrc = "/default-user.png";
            const [firstName, lastName] = name.split(" ");
            return (
                <Link
                    className="flex items-center gap-3"
                    href={`/staff/${gymMemberId}`}
                >
                    <Avatar size="lg">
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
        accessorKey: "role",
        header: "ROLE",
        cell: ({ row }) => {
            const { role } = row.original;
            return (
                <h2>{role.split("")[0].toUpperCase() + role.substring(1)}</h2>
            );
        },
    },

    {
        accessorKey: "joinedOn",
        header: "JOINED ON",
        cell({ getValue }) {
            return (
                <time dateTime={getValue() as string}>
                    {formatDate(getValue() as string)}
                </time>
            );
        },
    },
    {
        accessorKey: "isActive",
        header: "STATUS",
        cell({ getValue }) {
            return (
                <Badge variant={(getValue() as string) ? "active" : "inactive"}>
                    {(getValue() as string) ? "Active" : "Inactive"}
                </Badge>
            );
        },
    },
    {
        header: "ACTIONS",
        cell(props) {
            return <StaffActionCell data={props.row.original} />;
        },
    },
];

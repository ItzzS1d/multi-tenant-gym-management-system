"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge, badgeVariants } from "@/shared/components/ui/badge";
import { capitalize, formatDate } from "@/shared/lib/utils";
import { getInvitationsList } from "../invitations-queries";
import InvitationActionCell from "./invitation-action-cell";
import { VariantProps } from "class-variance-authority";

export type InvitationColumnProps = Awaited<
    ReturnType<typeof getInvitationsList>
>[number];

export const INVITATION_TABLE_COLUMNS: ColumnDef<InvitationColumnProps>[] = [
    {
        id: "staff",
        header: "STAFF NAME",
        cell: ({ row }) => {
            const { email, firstName, lastName } = row.original;
            return (
                <Link
                    className="flex items-center gap-3"
                    // href={`/staff/${gymMemberId}`}
                    href={"/login"}
                >
                    <div>
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
        cell: ({ getValue }) => {
            return <h2>{capitalize(getValue() as string)}</h2>;
        },
    },

    {
        accessorKey: "inviterName",
        header: "INVITED BY",
    },
    {
        accessorKey: "createdAt",
        header: "INVITED ON",
        cell({ getValue }) {
            return formatDate(getValue() as Date);
        },
    },

    {
        accessorKey: "expiresAt",
        header: "EXPIRES ON",
        cell({ getValue }) {
            return formatDate(getValue() as Date);
        },
    },
    {
        accessorKey: "status",
        header: "STATUS",
        cell({ getValue }) {
            return (
                <Badge
                    variant={
                        getValue() as VariantProps<
                            typeof badgeVariants
                        >["variant"]
                    }
                >
                    {capitalize(getValue() as string)}
                </Badge>
            );
        },
    },
    {
        header: "ACTIONS",
        cell({ row }) {
            return <InvitationActionCell data={row.original} />;
        },
    },
];

"use client";
import { ColumnDef } from "@tanstack/react-table";
import { getStaffStatsAndTableData } from "../staff-queries";
import Link from "next/link";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/shared/components/ui/avatar";
import { GENDER } from "../../../../prisma/generated/prisma/enums";

export type StaffTableColumnProps = Awaited<
    ReturnType<typeof getStaffStatsAndTableData>
>["records"][number];

export const STAFF_TABLE_COLUMNS: ColumnDef<StaffTableColumnProps>[] = [
    {
        id: "staff",
        header: "STAFF NAME",
        cell: ({ row }) => {
            const { email, firstName, lastName, gymMemberId, image, gender } =
                row.original;
            const avatarSrc =
                gender === GENDER.MALE
                    ? "/mail-avatar.png"
                    : "/female-avatar.png";
            return (
                <Link
                    className="flex items-center gap-3"
                    href={`/staff/${gymMemberId}`}
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
];

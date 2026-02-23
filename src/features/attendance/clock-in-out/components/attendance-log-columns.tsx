"use client";
import { Badge } from "@/shared/components/ui/badge";
import { ColumnDef, Row } from "@tanstack/react-table";
import { getMembersListAndAttendanceLog } from "../../attendance-queries";
import { Button } from "@/shared/components/ui/button";
import { LogOut } from "lucide-react";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { punchMember } from "../../attendance-actions";
import { Spinner } from "@/shared/components/ui/spinner";

export type Attendancetablecolumnsprops = Awaited<
    ReturnType<typeof getMembersListAndAttendanceLog>
>["records"][number];

const AttendanceLogActionCell = ({
    row,
}: {
    row: Row<Attendancetablecolumnsprops>;
}) => {
    const { isInsideGym, isFinished } = row.original.attendance;
    const { handleAction, loading } = useActionHandler();

    const onCheckout = async () => {
        await handleAction(
            punchMember,
            {
                memberId: row.original.member.memberId,
                status: "out",
            },
            {
                successMessage: "Member checked out successfully!",
            },
        );
    };

    if (isFinished || !isInsideGym) {
        return null;
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 gap-1"
            disabled={loading}
            onClick={onCheckout}
        >
            {loading ? <Spinner /> : <LogOut size={14} />}
            Check Out
        </Button>
    );
};

export const ATTENDANCE_LOG_TABLE_COLUMNS: ColumnDef<Attendancetablecolumnsprops>[] =
    [
        {
            id: "name",
            header: "MEMBER",
            cell({ row }) {
                return row.original.user.name;
            },
        },
        {
            id: "phone",
            header: "PHONE",
            cell({ row }) {
                return row.original.user.phone;
            },
        },
        {
            id: "checkIn",
            header: "CHECK-IN",
            cell({ row }) {
                const checkIn = row.original.attendance.checkIn;
                if (!checkIn) return "—";
                return new Date(checkIn).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            },
        },
        {
            id: "checkOut",
            header: "CHECK-OUT",
            cell({ row }) {
                const checkOut = row.original.attendance.checkOut;
                if (!checkOut) return "—";
                return new Date(checkOut).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            },
        },
        {
            id: "status",
            header: "STATUS",
            cell({ row }) {
                const { isFinished, isInsideGym } = row.original.attendance;

                if (isFinished) {
                    return <Badge variant="active">Completed</Badge>;
                }

                if (isInsideGym) {
                    return <Badge variant="pending">Inside Gym</Badge>;
                }

                return <Badge variant="expired">Absent</Badge>;
            },
        },
        {
            id: "actions",
            header: "ACTIONS",
            cell({ row }) {
                return <AttendanceLogActionCell row={row} />;
            },
        },
    ];

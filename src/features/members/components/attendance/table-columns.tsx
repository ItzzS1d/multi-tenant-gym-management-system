"use client";
import { ColumnDef } from "@tanstack/react-table";
import { getAttendanceAnalytics } from "../../new/queries";
import { formatDate, formatMinutes } from "@/shared/lib/utils";
import { format } from "date-fns";

type Attendancetablecolumnsprops = Awaited<
    ReturnType<typeof getAttendanceAnalytics>
>["records"][number];
export const ATTENDANCE_TABLE_COLUMNS: ColumnDef<Attendancetablecolumnsprops>[] =
    [
        {
            accessorKey: "attendanceDate",
            header: "DATE",
            cell({ getValue }) {
                return formatDate(getValue() as Date);
            },
        },
        {
            accessorKey: "checkInAt",
            header: "CHECK-IN",
            cell({ getValue }) {
                return format(getValue() as Date, "hh:mm a");
            },
        },
        {
            accessorKey: "checkOutAt",
            header: "CHECK-OUT",
            cell({ getValue }) {
                return format(getValue() as Date, "hh:mm a");
            },
        },
        {
            accessorKey: "totalDuration",
            header: "DURATION",
            cell({ getValue }) {
                return formatMinutes(getValue() as number);
            },
        },
    ];

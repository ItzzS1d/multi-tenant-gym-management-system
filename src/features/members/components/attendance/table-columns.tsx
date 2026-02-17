"use client";
import { ColumnDef } from "@tanstack/react-table";
import { getAttendanceAnalytics } from "../../new/queries";

type Attendancetablecolumnsprops = Awaited<
    ReturnType<typeof getAttendanceAnalytics>
>["records"][number];
export const ATTENDANCE_TABLE_COLUMNS: ColumnDef<Attendancetablecolumnsprops>[] =
    [
        {
            accessorKey: "attendanceDate",
            header: "DATE",
        },
        {
            accessorKey: "checkInAt",
            header: "CHECK-IN",
        },
        {
            accessorKey: "checkOutAt",
            header: "CHECK-OUT",
        },
        {
            accessorKey: "totalDuration",
            header: "DURATION",
        },
    ];

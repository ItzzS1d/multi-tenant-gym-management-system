"use client";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { CalendarDays, Search } from "lucide-react";
import { use, useState } from "react";
import useSwr from "swr";
import { format } from "date-fns";
import { getMembersListAndAttendanceLog } from "../../attendance-queries";
import { Attendancetablecolumnsprops } from "./attendance-log-columns";
import EmptyAttendanceTableState from "@/shared/components/table/empty-table-state";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { DatePicker } from "@/shared/components/ui/date-picker";

interface AttendanceLogTabelProps {
    attendanceLogPromise: ReturnType<typeof getMembersListAndAttendanceLog>;
    columns: ColumnDef<Attendancetablecolumnsprops>[];
    gymId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const AttendanceLogTabel = ({
    attendanceLogPromise,
    columns,
    gymId,
}: AttendanceLogTabelProps) => {
    const initialData = use(attendanceLogPromise);
    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), "yyyy-MM-dd"),
    );

    const { data, isLoading } = useSwr(
        `/api/gyms/${gymId}/members/log?date=${selectedDate}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: false,
            fallbackData: initialData.records,
        },
    );

    const tableData = data?.records || initialData.records;

    const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: tableData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilter,
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 15,
            },
        },
    });

    const handleDateChange = (date?: Date) => {
        if (!date) return;

        const formatted = format(date, "yyyy-MM-dd");

        setSelectedDate(formatted);
    };

    return (
        <div>
            <div className="overflow-x-auto rounded-xl shadow-sm border ">
                {/* Header */}
                <div className="flex justify-between items-center py-2.5 shadow px-4 rounded-t-xl border-[#e7f3eb]">
                    <h3 className="text-lg font-semibold flex items-center text-primary">
                        <CalendarDays className="mr-2" aria-hidden />
                        <span className="text-black">Attendance Log</span>
                    </h3>
                    <div className="w-48">
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                </div>

                <div className="relative">
                    {/* Loader Overlay - Pattern from AttendanceHistoryCalender */}
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                                <p className="text-sm text-muted-foreground">
                                    Loading attendance log...
                                </p>
                            </div>
                        </div>
                    )}
                    <table
                        className={cn(
                            "w-full text-left border-collapse transition-opacity duration-200",
                            isLoading && "opacity-50 pointer-events-none",
                        )}
                    >
                        <thead className="bg-[#f8fcf9] dark:bg-[#102216] text-xs">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="text-[10px] md:text-xs px-4 border-y text-[#4c9a66] dark:text-text-sub-dark bg-[#e7f3eb]   rounded whitespace-nowrap py-4"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody className="divide-y divide-[#e7f3eb]  ">
                            {tableData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <EmptyAttendanceTableState
                                            title="No Attendance Records"
                                            description="No attendance records found for this period."
                                            icon={<CalendarDays />}
                                        />
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <EmptyAttendanceTableState
                                            title="No results found"
                                            description="No attendance records match your search criteria."
                                            icon={<Search />}
                                        />
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        className={cn(
                                            "hover:bg-[#f8fcf9] dark:hover:bg-[#102216]/50 ",
                                            i % 2 !== 0 && "bg-[#f8fcf9]",
                                        )}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className="px-4 py-4"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center  p-4 text-xs  border-t bg-[#f8fcf9]">
                    <p className="text-[10px] md:text-sm text-[#4c9a66] dark:text-text-sub-dark  px-2 py-1 rounded whitespace-nowrap">
                        Showing {table.getRowModel().rows.length} of{" "}
                        {tableData.length} check-ins{" "}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="px-4    border rounded "
                            onClick={table.previousPage}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            className="px-4  border rounded"
                            onClick={table.nextPage}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceLogTabel;

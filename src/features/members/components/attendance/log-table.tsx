"use client";
import React, { use, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { CalendarDays, Download, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { getAttendanceAnalytics } from "../../new/queries";
import EmptyAttendanceTableState from "../../../../shared/components/table/empty-table-state";

export const datas = [
    {
        attendanceDate: "Oct 24, 2023",
        checkInAt: "07:30 AM",
        checkOutAt: "08:52 AM",
        totalDuration: "1h 22m",
    },
    {
        attendanceDate: "Oct 23, 2023",
        checkInAt: "07:28 AM",
        checkOutAt: "08:40 AM",
        totalDuration: "1h 12m",
    },
    {
        attendanceDate: "Oct 22, 2023",
        checkInAt: "08:15 AM",
        checkOutAt: "09:30 AM",
        totalDuration: "1h 15m",
    },
    {
        attendanceDate: "Oct 21, 2023",
        checkInAt: "07:45 AM",
        checkOutAt: "08:50 AM",
        totalDuration: "1h 05m",
    },
    {
        attendanceDate: "Oct 19, 2023",
        checkInAt: "06:12 PM",
        checkOutAt: "07:45 PM",
        totalDuration: "1h 33m",
    },
    {
        attendanceDate: "Oct 17, 2023",
        checkInAt: "07:35 AM",
        checkOutAt: "08:45 AM",
        totalDuration: "1h 10m",
    },
    {
        attendanceDate: "Oct 15, 2023",
        checkInAt: "09:00 AM",
        checkOutAt: "10:45 AM",
        totalDuration: "1h 45m",
    },
    {
        attendanceDate: "Oct 13, 2023",
        checkInAt: "07:42 AM",
        checkOutAt: "08:38 AM",
        totalDuration: "56m",
    },
    {
        attendanceDate: "Oct 11, 2023",
        checkInAt: "06:20 PM",
        checkOutAt: "07:30 PM",
        totalDuration: "1h 10m",
    },
    {
        attendanceDate: "Oct 09, 2023",
        checkInAt: "07:18 AM",
        checkOutAt: "08:25 AM",
        totalDuration: "1h 07m",
    },
    {
        attendanceDate: "Oct 06, 2023",
        checkInAt: "08:05 AM",
        checkOutAt: "09:12 AM",
        totalDuration: "1h 07m",
    },
    {
        attendanceDate: "Oct 03, 2023",
        checkInAt: "07:50 AM",
        checkOutAt: "08:58 AM",
        totalDuration: "1h 08m",
    },
];

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    attendancePromise: ReturnType<typeof getAttendanceAnalytics>;
    availableYears: number[];
    month?: number;
    year?: number;
}
function AttendanceLogTable<TData, TValue>({
    attendancePromise,
    columns,
    availableYears,
    month,
    year,
}: DataTableProps<TData, TValue>) {
    const tableData = use(attendancePromise);
    const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data: tableData.records,
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
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Generate Month-Year options based on availableYears
    const monthYearOptions = React.useMemo(() => {
        const options: { label: string; value: string }[] = [];
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth(); // 0-11

        availableYears.forEach((yearItem) => {
            const startMonth = 0;
            const endMonth = yearItem === currentYear ? currentMonth : 11;

            for (let m = endMonth; m >= startMonth; m--) {
                const date = new Date(yearItem, m);
                options.push({
                    label: format(date, "MMMM yyyy"),
                    value: `${m + 1}-${yearItem}`, // format: "month-year" (1-12)
                });
            }
        });
        return options;
    }, [availableYears]);

    const handleFilterChange = (value: string | null) => {
        if (!value) return;
        const [m, y] = value.split("-");
        const params = new URLSearchParams(searchParams.toString());
        if (m && y) {
            params.set("month", m);
            params.set("year", y);
        } else {
            params.delete("month");
            params.delete("year");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const currentValue = month && year ? `${month}-${year}` : undefined;
    const currentLabel = currentValue
        ? monthYearOptions.find((o) => o.value === currentValue)?.label
        : "This Month";

    return (
        <div className="overflow-x-auto  rounded-xl shadow-sm border ">
            {/* Header */}
            <div className="flex justify-between items-center   py-2.5 shadow px-4 rounded-t-xl border-[#e7f3eb]">
                <h3 className="text-lg font-semibold flex items-center  text-primary">
                    <CalendarDays className="mr-2" aria-hidden />
                    <span className="text-black">Attendance Log</span>
                </h3>
                <div className="flex gap-2 text-xs items-center">
                    <Select
                        value={currentValue}
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger className="min-w-0 w-[200px] py-4.5 max-w-xs border-2 bg-[#f8fcf9]    text-sm font-medium  border-[#e7f3eb]">
                            <SelectValue placeholder="Select Month">
                                {currentLabel}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="font-medium text-sm max-h-[200px]">
                            {monthYearOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="link">Filter</Button>
                    <Button variant="link" size="icon-lg">
                        <Download />
                    </Button>
                </div>
            </div>

            <table className="w-full text-left border-collapse">
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
                    {tableData.records.length === 0 ? (
                        <tr className="bg-transparent hover:bg-transparent">
                            <td colSpan={columns.length} className="p-0">
                                <EmptyAttendanceTableState
                                    title="No Attendance Records"
                                    description="No attendance records found for this period."
                                    icon={<CalendarDays />}
                                />
                            </td>
                        </tr>
                    ) : table.getRowModel().rows.length === 0 ? (
                        <tr className="bg-transparent hover:bg-transparent">
                            <td colSpan={columns.length} className="p-0">
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
                                    <td key={cell.id} className="px-4 py-4">
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

            {/* Footer */}
            <div className="flex justify-between items-center  p-4 text-xs  border-t bg-[#f8fcf9]">
                <p className="text-[10px] md:text-sm text-[#4c9a66] dark:text-text-sub-dark  px-2 py-1 rounded whitespace-nowrap">
                    Showing {table.getRowModel().rows.length} of{" "}
                    {tableData.records.length} check-ins{" "}
                    {currentLabel && `in ${currentLabel}`}
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
    );
}

export default AttendanceLogTable;

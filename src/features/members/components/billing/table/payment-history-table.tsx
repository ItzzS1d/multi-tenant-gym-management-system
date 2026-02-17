"use client";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { CalendarDays, Download, Receipt, Search } from "lucide-react";
import { use } from "react";
import EmptyPaymentsHistoryTableState from "../../../../../shared/components/table/empty-table-state";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: Promise<TData[]>;
}
function PaymentHistoryTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const tableData = use(data);
    const table = useReactTable({
        data: tableData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 15,
            },
        },
    });
    return (
        <div className="overflow-x-auto rounded-xl shadow-sm border w-full">
            {/* Header */}
            <div className="flex justify-between items-center   py-2.5 shadow px-4 rounded-t-xl border-[#e7f3eb]">
                <h3 className="text-lg font-semibold flex items-center  text-primary">
                    <CalendarDays className="mr-2" aria-hidden />
                    <span className="text-black">Attendance Log</span>
                </h3>
                <div className="flex gap-2 text-xs items-center">
                    <Button variant="link" size="icon-lg">
                        <Download />
                        Statement
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
                    {tableData.length === 0 ? (
                        <EmptyPaymentsHistoryTableState
                            title="No Payments Recorded"
                            description="There are no payment records for this member yet."
                            icon={<Receipt />}
                        />
                    ) : table.getRowModel().rows.length === 0 ? (
                        <EmptyPaymentsHistoryTableState
                            title="No results found"
                            description="No payments match your search criteria."
                            icon={<Search />}
                        />
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
                    Showing 7 of 12 check-ins this month
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

export default PaymentHistoryTable;

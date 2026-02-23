"use client";
import { use, useState } from "react";

import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Download, Search, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import EmptyAttendanceTableState from "@/shared/components/table/empty-table-state";
import { InvitationColumnProps } from "./invitation-table-columns";
import { getInvitationsList } from "../invitations-queries";
import FilterTableInput from "@/shared/components/table/table-filter-input";
import TableFilterSelect from "@/shared/components/table/table-filter-select";

const FILTER_OPTIONS = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Expired", value: "expired" },
    { label: "Revoked", value: "revoked" },
];
interface DataTableProps {
    columns: ColumnDef<InvitationColumnProps>[];
    invitationsListPromise: ReturnType<typeof getInvitationsList>;
}
function InvitationsTable({ invitationsListPromise, columns }: DataTableProps) {
    const tableData = use(invitationsListPromise);
    const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });

        return itemRank.passed;
    };
    const table = useReactTable({
        data: tableData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getSortedRowModel: getSortedRowModel(),
        enableGlobalFilter: true,
        globalFilterFn: "fuzzy",
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            globalFilter,
            columnFilters: columnFilter,
        },
        initialState: {
            pagination: {
                pageSize: 15,
            },
        },
    });

    return (
        <div className="overflow-x-auto  rounded-xl shadow-sm border ">
            {/* Header */}
            <div className="flex justify-between items-center flex-col md:flex-row gap-5   py-2.5 shadow px-4 rounded-t-xl border-[#e7f3eb]">
                <FilterTableInput
                    className="max-w-sm"
                    placeholder="Search staff by email name or phone"
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
                <div className="flex gap-2 text-xs items-center">
                    <Select
                        items={FILTER_OPTIONS}
                        onValueChange={(value) => {
                            const column = table.getColumn("status");
                            column?.setFilterValue(
                                value === "all" ? undefined : value,
                            );
                        }}
                    >
                        <SelectTrigger className="w-33 shrink-0">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent side="bottom" sideOffset={5}>
                            {FILTER_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

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
                    {tableData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                <EmptyAttendanceTableState
                                    description="No Invitaions found. Invite a new staff member to get started."
                                    title="No Invitations Found"
                                    icon={<Users />}
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
                                    description="No Invitations match your search criteria. Try adjusting your filters."
                                    title="No results found"
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
                    {tableData.length} check-ins{" "}
                    {/*{currentLabel && `in ${currentLabel}`}*/}
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

export default InvitationsTable;

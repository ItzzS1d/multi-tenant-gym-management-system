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
import EmptyAttendanceTableState from "../../../../shared/components/table/empty-table-state";
import { getMemberList } from "../queries";
import { MemberTableColumnProps } from "./member-table-colums";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import CreateButton from "@/shared/components/create-button";
import { getPlansList } from "../../new/queries";
import FilterTableInput from "@/shared/components/dialog/table-filter-input";

const STATUS_FILTER = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Active",
        value: "active",
    },
    {
        label: "Expiring Soon",
        value: "expiring",
    },
    {
        label: "Expired",
        value: "expired",
    },
];

interface DataTableProps {
    columns: ColumnDef<MemberTableColumnProps>[];
    membersListPromise: ReturnType<typeof getMemberList>;
    plansListPromise: ReturnType<typeof getPlansList>;
}
function MembersTable({
    membersListPromise: attendancePromise,
    columns,
    plansListPromise,
}: DataTableProps) {
    const tableData = use(attendancePromise);
    const plansList = use(plansListPromise);
    const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });

        return itemRank.passed;
    };
    const table = useReactTable({
        data: tableData.records,
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
            <div className="flex justify-between items-center   py-2.5 shadow px-4 rounded-t-xl border-[#e7f3eb]">
                <FilterTableInput
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    placeholder="Search Member by email name or phone"
                />
                <div className="flex gap-2 text-xs items-center">
                    <Select
                        items={STATUS_FILTER}
                        onValueChange={(value) => {
                            const column = table.getColumn("status");

                            column?.setFilterValue(
                                value === "all"
                                    ? undefined
                                    : (value as string).toUpperCase(),
                            );
                        }}
                    >
                        <SelectTrigger className="w-34">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="Expiring Soon">
                                Expiring Soon
                            </SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        items={plansList.map((plan) => ({
                            label: plan.name,
                            value: plan.id,
                        }))}
                        onValueChange={(value) => {
                            const column = table.getColumn("status");

                            column?.setFilterValue(
                                value === "all"
                                    ? undefined
                                    : (value as string).toUpperCase(),
                            );
                        }}
                    >
                        <SelectTrigger className="w-34">
                            <SelectValue placeholder="Filter by plan" />
                        </SelectTrigger>

                        <SelectContent>
                            {plansList.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                    {plan.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="link" size="icon-lg">
                        <Download />
                    </Button>
                    <CreateButton label="Add New Member" href="/members/new" />
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
                            <td colSpan={columns.length}>
                                <EmptyAttendanceTableState
                                    title="No Members Found"
                                    description="No members found. Add a new member to get started."
                                    icon={<Users />}
                                />
                            </td>
                        </tr>
                    ) : table.getRowModel().rows.length === 0 ? (
                        <tr className="bg-transparent hover:bg-transparent">
                            <td colSpan={columns.length}>
                                <EmptyAttendanceTableState
                                    title="No results found"
                                    description="No members match your search criteria."
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

export default MembersTable;

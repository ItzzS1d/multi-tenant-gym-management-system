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
import { MemberTableColumnProps } from "./member-table-colums";

import CreateButton from "@/shared/components/create-button";
import { getPlansList } from "../../new/queries";
import FilterTableInput from "@/shared/components/table/table-filter-input";
import TableFilterSelect from "@/shared/components/table/table-filter-select";

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
    data: Promise<MemberTableColumnProps[]>;
    plansListPromise: ReturnType<typeof getPlansList>;
}
function MembersTable({
    data: membersPromise,
    columns,
    plansListPromise,
}: DataTableProps) {
    const tableData = use(membersPromise);
    const plansList = use(plansListPromise);
    const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const fuzzyFilter: FilterFn<MemberTableColumnProps> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });

        return itemRank.passed;
    };
    const table = useReactTable<MemberTableColumnProps>({
        data: tableData,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getSortedRowModel: getSortedRowModel(),
        enableGlobalFilter: true,
        globalFilterFn: fuzzyFilter,
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
                    <TableFilterSelect
                        options={STATUS_FILTER}
                        placeholder="Filter by status"
                        table={table}
                        columnName="status"
                    />

                    <TableFilterSelect
                        options={plansList.map((plan) => ({
                            label: plan.name,
                            value: plan.id,
                        }))}
                        placeholder="Filter by plan"
                        table={table}
                        columnName="status"
                    />
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
                    {tableData.length === 0 ? (
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

export default MembersTable;

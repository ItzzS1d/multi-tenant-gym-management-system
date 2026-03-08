"use client";
import { use, useState } from "react";
import { getMemberList } from "../queries";

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
import { motion } from "framer-motion";

import CreateButton from "@/shared/components/create-button";
import FilterTableInput from "@/shared/components/table/table-filter-input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Route } from "next";

const STATUS_FILTER = [
    {
        label: "All",
        value: "all",
        color: "bg-gray-400",
    },
    {
        label: "Active",
        value: "active",
        color: "bg-green-500",
    },
    {
        label: "Expiring Soon",
        value: "expiring",
        color: "bg-orange-500",
    },
    {
        label: "Expired",
        value: "expired",
        color: "bg-red-500",
    },
];

interface DataTableProps {
    columns: ColumnDef<MemberTableColumnProps>[];
    membersPromise: ReturnType<typeof getMemberList>;
}
function MembersTable({ membersPromise, columns }: DataTableProps) {
    const { stats, records: tableData } = use(membersPromise);
    const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const fuzzyFilter: FilterFn<MemberTableColumnProps> = (
        row,
        columnId,
        value,
        addMeta,
    ) => {
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
        <div className="space-y-4">
            {/* Line Style Tabs */}

            <div className="overflow-x-auto  rounded-xl shadow-sm border ">
                <Tabs
                    defaultValue="all"
                    value={
                        (table
                            .getColumn("status")
                            ?.getFilterValue() as string) ?? "all"
                    }
                    onValueChange={(value) =>
                        table
                            .getColumn("status")
                            ?.setFilterValue(
                                value === "all" ? undefined : value,
                            )
                    }
                    className="w-full"
                >
                    <TabsList className="bg-transparent  w-full justify-start h-auto p-0 gap-4">
                        {STATUS_FILTER.map((filter) => {
                            const count =
                                filter.value === "all"
                                    ? stats.totalMembers
                                    : filter.value === "active"
                                        ? stats.active
                                        : filter.value === "expiring"
                                            ? stats.expiringSoon
                                            : stats.expired;

                            return (
                                <TabsTrigger
                                    key={filter.value}
                                    value={filter.value}
                                    className={cn(
                                        "px-1 pb-5 py-4 pt-5 text-sm font-medium transition-all relative rounded-none border-0 group/tabs-trigger bg-transparent ",
                                        "data-active:text-primary data-active:font-bold data-active:bg-transparent data-active:shadow-none",
                                        "text-gray-500 hover:text-primary dark:text-gray-400",
                                        "after:hidden ",
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{filter.label}</span>
                                        <span
                                            className={cn(
                                                "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors",
                                                "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                                                "group-data-active/tabs-trigger:bg-primary/20 group-data-active/tabs-trigger:text-primary",
                                            )}
                                        >
                                            {count}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none">
                                        {(table.getColumn("status")?.getFilterValue() ?? "all") ===
                                            filter.value && (
                                                <motion.div
                                                    layoutId="activeTabIndicator"
                                                    className="h-[2px] w-1/2 bg-primary rounded-full"
                                                    transition={{
                                                        type: "spring",
                                                        bounce: 0.2,
                                                        duration: 0.6,
                                                    }}
                                                />
                                            )}
                                    </div>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
                {/* Header */}
                <div className="flex justify-between items-center   py-2.5 shadow px-4 rounded-t-xl border-[#e7f3eb]">
                    <FilterTableInput
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        placeholder="Search Member by email name or phone"
                    />
                    <div className="flex gap-2 text-xs items-center">
                        <Button variant="link" size="icon-lg">
                            <Download />
                        </Button>
                        <CreateButton
                            label="Add New Member"
                            href={"/members/new" as Route}
                        />
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
        </div>
    );
}

export default MembersTable;

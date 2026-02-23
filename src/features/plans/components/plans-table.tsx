"use client";
import EmptyAttendanceTableState from "@/shared/components/table/empty-table-state";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowDownToLine,
    Banknote,
    ListFilter,
    Receipt,
    Search,
} from "lucide-react";
import { use, useState } from "react";
import { getPlansDashboardData } from "../queries";
import { PlansDashboardData } from "./plans-table-columns";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import NewPlanForm from "./plan-form";
import CreateButton from "@/shared/components/create-button";
import { Combobox } from "@/shared/components/ui/combobox";

interface PlansTableProps {
    columns: ColumnDef<PlansDashboardData>[];
    data: Promise<PlansDashboardData[]>;
}

function PlansTable({ data: plansPromise, columns }: PlansTableProps) {
    const tableData = use(plansPromise);
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
                pageSize: 10,
            },
        },
        state: {
            columnFilters: columnFilter,
        },
    });

    const handleFilterChange = (value: string | null) => {
        table.setPageIndex(0);
        if (!value || value === "All") {
            table.setColumnFilters([]);
            return;
        }

        const filterValue = value === "Active";
        table.setColumnFilters([{ id: "isActive", value: filterValue }]);
    };

    return (
        <div className="overflow-x-auto  rounded-xl shadow-sm border max-h-500">
            {/* Header */}
            <div className="flex justify-between items-center   py-2.5 shadow px-4 rounded-t-xl border-[#e7f3eb]">
                <h3 className="text-lg font-medium flex items-center  text-primary">
                    <span className="text-black">All Plans</span>
                </h3>
                <div className="flex gap-2 text-xs items-center">

                    <Select
                        onValueChange={handleFilterChange}
                        value={
                            table.getColumn("isActive")?.getFilterValue() ===
                                true
                                ? "Active"
                                : table
                                    .getColumn("isActive")
                                    ?.getFilterValue() === false
                                    ? "Inactive"
                                    : ""
                        }
                    >
                        <SelectTrigger
                            size="sm"
                            className={"py-4"}
                            onClick={(e) => e.stopPropagation()}
                            icon={<ListFilter />}
                        >
                            <SelectValue placeholder="Filter " />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">
                                    Inactive
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Button variant="ghost">
                        Export
                        <ArrowDownToLine />
                    </Button>
                    <CreateButton
                        label="Add New Plan"
                        size="sm"
                        className="text-accent py-4.5"
                        dialog={{
                            content: <NewPlanForm mode="CREATE" />,
                            title: "Add New Membership Plan",
                            titleDescription: "Add new plan to your gym.",
                            titleIcon: <Banknote />,
                        }}
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
                            <td colSpan={columns.length} className="p-0">
                                <EmptyAttendanceTableState
                                    title="No Plans Found"
                                    description="No plans created yet. Add a new plan to get started."
                                    icon={<Receipt />}
                                />
                            </td>
                        </tr>
                    ) : table.getRowModel().rows.length === 0 ? (
                        <tr className="bg-transparent hover:bg-transparent">
                            <td colSpan={columns.length} className="p-0">
                                <EmptyAttendanceTableState
                                    title="No results found"
                                    description="No plans match your search criteria."
                                    icon={<Search />}
                                />
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className={cn(
                                    "hover:bg-[#f8fcf9]  text-sm font-medium",
                                    !row.original.isActive &&
                                    "[&>td]:text-gray-400",
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
                    {tableData.length} plans{" "}
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

export default PlansTable;

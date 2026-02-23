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
import { Download, Search, UserPlus, Users, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/shared/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import CreateButton from "@/shared/components/create-button";
import { StaffTableColumnProps } from "./staff-table-columns";
import { getStaffStatsAndTableData } from "../staff-queries";
import { Role } from "../../../../prisma/generated/prisma/enums";
import EmptyAttendanceTableState from "@/shared/components/table/empty-table-state";
import InviteStaffForm from "./invite-staff-form";

interface DataTableProps {
    columns: ColumnDef<StaffTableColumnProps>[];
    data: Promise<StaffTableColumnProps[]>;
}
const STAFF_ROLES_OPTIONS = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Admin",
        value: Role.admin,
    },
    {
        label: "Trainer",
        value: Role.trainer,
    },
];
function StaffTable({ data: staffPromise, columns }: DataTableProps) {
    const tableData = use(staffPromise);
    const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const fuzzyFilter: FilterFn<StaffTableColumnProps> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });

        return itemRank.passed;
    };
    const table = useReactTable<StaffTableColumnProps>({
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
                <InputGroup className="max-w-sm">
                    <InputGroupInput
                        placeholder="Search staff by email name or phone"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                    <InputGroupAddon>
                        {globalFilter ? (
                            <Button
                                variant={"ghost"}
                                onClick={() => setGlobalFilter("")}
                            >
                                <XCircle />
                            </Button>
                        ) : (
                            <Search />
                        )}
                    </InputGroupAddon>
                </InputGroup>
                <div className="flex gap-2 text-xs items-center">
                    <Select
                        items={STAFF_ROLES_OPTIONS}
                        onValueChange={(value) => {
                            const column = table.getColumn("role");

                            column?.setFilterValue(
                                value === "all"
                                    ? undefined
                                    : (value as string).toUpperCase(),
                            );
                        }}
                    >
                        <SelectTrigger className="w-34">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>

                        <SelectContent>
                            {STAFF_ROLES_OPTIONS.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="link" size="icon-lg">
                        <Download />
                    </Button>
                    <CreateButton
                        label="Invite Staff Member"
                        dialog={{
                            content: <InviteStaffForm />,
                            title: "Invite Staff Member",
                            titleDescription:
                                "Invite a new staff member to your gym.",
                            titleIcon: <UserPlus />,
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
                        <tr>
                            <td colSpan={columns.length} className="h-24 text-center">
                                <EmptyAttendanceTableState
                                    description="No staff members found. Add a new staff member to get started."
                                    title="No Staff Found"
                                    icon={<Users />}
                                />
                            </td>
                        </tr>
                    ) : table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="h-24 text-center">
                                <EmptyAttendanceTableState
                                    description="No staff members match your search criteria. Try adjusting your filters."
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

export default StaffTable;

"use client";
import EmptyAttendanceTableState from "@/shared/components/table/empty-table-state";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
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
import {
    ArrowDownToLine,
    ChevronDown,
    PlusCircleIcon,
    Receipt,
    Search,
} from "lucide-react";
import { use, useState } from "react";
import CreateButton from "@/shared/components/create-button";
import { ExpenseTableColumns } from "./expenses-table-columns";
import FilterTableInput from "@/shared/components/dialog/table-filter-input";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from "@/shared/components/ui/combobox";
import { getExpenesList } from "../../expenses-queries";
import NewExpenseForm, { EXPENSE_CATEGORY_OPTIONS } from "../expense-form";

interface ExpensesTableProps {
    columns: ColumnDef<ExpenseTableColumns>[];
    expensesPromise: ReturnType<typeof getExpenesList>;
}

function ExpensesTable({ expensesPromise, columns }: ExpensesTableProps) {
    const tableData = use(expensesPromise);
    const [columnFilter, setColumnFilter] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");

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
        <div className="overflow-x-auto  rounded-xl shadow-sm border max-h-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-2.5 shadow px-4 rounded-t-xl border-[#e7f3eb]">
                <FilterTableInput
                    className="w-full md:w-80"
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    placeholder="Search Expenses by name or description or category"
                />
                <div className="flex gap-2 text-xs items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Combobox
                        items={[
                            {
                                label: "Select Category",
                                value: "",
                            },
                            ...EXPENSE_CATEGORY_OPTIONS,
                        ]}
                        defaultValue={{
                            label: "Select Category",
                            value: "",
                        }}
                        onValueChange={(val) => {
                            table
                                .getColumn("category")
                                ?.setFilterValue(
                                    val?.label === "" ? undefined : val?.value,
                                );
                        }}
                    >
                        <ComboboxTrigger
                            render={
                                <Button
                                    variant="outline"
                                    className="w-64 justify-between font-normal"
                                >
                                    <ComboboxValue placeholder="Select Category">
                                        {(item) =>
                                            item?.label || "Select Category"
                                        }
                                    </ComboboxValue>
                                    <ChevronDown />
                                </Button>
                            }
                        />
                        <ComboboxContent>
                            <ComboboxInput
                                showTrigger={false}
                                placeholder="Search"
                                showClear
                            />
                            <ComboboxEmpty>No items found.</ComboboxEmpty>
                            <ComboboxList>
                                {(item) => (
                                    <ComboboxItem key={item.label} value={item}>
                                        {item.label}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>

                    <Button variant="ghost">
                        Export
                        <ArrowDownToLine />
                    </Button>
                    <CreateButton
                        label="Record New Expense"
                        size="lg"
                        icon={<PlusCircleIcon />}
                        dialog={{
                            content: <NewExpenseForm mode="CREATE" />,
                            title: "Record New Expense",
                            titleIcon: <Receipt />,
                            titleDescription:
                                "Record a new expense to your financial records",
                            size: "large",
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
                                    title="No Expenses Found"
                                    description="No expenses created yet. Add a new expense to get started."
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
                                    "hover:bg-[#f8fcf9] dark:hover:bg-[#102216]/50 text-sm font-medium",
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

export default ExpensesTable;

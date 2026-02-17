"use client";
import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useDialog } from "@/shared/hooks/useDialog";
import {
    MoreHorizontal,
    Edit,
    Trash,
    TriangleAlert,
    ReceiptText,
} from "lucide-react";
import { formatCurrency } from "@/shared/lib/utils";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { Spinner } from "@/shared/components/ui/spinner";
import {
    EditExpenseSchema,
    CreateExpenseSchema,
} from "../../expense-validation";
import { updateExpense, deleteExpense } from "../../expenses-action";
import NewExpenseForm from "../expense-form";

const ExpensesActionCell = ({
    defaultValues,
}: {
    defaultValues: EditExpenseSchema;
}) => {
    const { openDialog, closeDialog } = useDialog();
    const { handleAction, loading } = useActionHandler();
    const handleEdit = () => {
        openDialog({
            title: "Edit Expense",
            titleIcon: <Edit className="h-4 w-4" />,
            titleDescription: "Edit your expense details",
            size: "large",
            type: "form",
            content: (
                <NewExpenseForm
                    mode="EDIT"
                    action={updateExpense}
                    defaultValues={defaultValues as CreateExpenseSchema}
                />
            ),
        });
    };

    const confirmDelete = async () => {
        await handleAction(deleteExpense, defaultValues.id, {
            onSuccess() {
                closeDialog();
            },
        });
    };

    const showDeleteDialog = () => {
        openDialog({
            type: "confirmation",
            title: "Delete Expense?",
            titleDescription:
                "Are you sure you want to delete this expense? This action cannot be undone and will remove the record from your financial reports.",
            titleIcon: <TriangleAlert className="w-8 h-8" />,
            content: (
                <div className="mt-6 w-full p-4 bg-slate-50 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                            <ReceiptText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                                Expense Name
                            </p>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                #EXP-{defaultValues.title}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                            Amount
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {formatCurrency(defaultValues.amount!)}
                        </p>
                    </div>
                </div>
            ),
            footer: (
                <div className="flex justify-center gap-5 w-full">
                    <Button
                        onClick={closeDialog}
                        disabled={loading}
                        className={"w-30"}
                        variant={"outline"}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            confirmDelete();
                        }}
                        disabled={loading}
                        variant="destructive"
                        className={"w-30"}
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </div>
            ),
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-50">
                <DropdownMenuItem
                    className="flex justify-between"
                    onClick={handleEdit}
                >
                    Edit
                    <Edit className="h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    variant="destructive"
                    className="flex justify-between"
                    onClick={showDeleteDialog}
                >
                    Delete
                    <Trash className="h-4 w-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ExpensesActionCell;

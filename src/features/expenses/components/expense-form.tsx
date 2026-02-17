"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    CreateExpenseSchema,
    expensesBaseSchema,
    editExpenseSchema,
    EditExpenseSchema,
    ExpensesBaseSchema,
} from "../expense-validation";
import FormInput from "@/shared/components/ui/form-input";
import {
    EXPENSE_CATEGORY,
    EXPENSE_NATURE,
    EXPENSE_PAYMENT_METHOD,
    RECURRING_INTERVAL,
} from "../../../../prisma/generated/prisma/enums";
import { History, Save } from "lucide-react";
import FormButtons from "@/shared/components/dialog/form-btn";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { createNewExpense, updateExpense } from "../expenses-action";
import { useDialog } from "@/shared/hooks/useDialog";
import { startOfToday } from "date-fns";
import { ActionResponse } from "@/shared/lib/action-response";
import { ExpenseUpdateInput } from "../../../../prisma/generated/prisma/models";

export const EXPENSE_CATEGORY_OPTIONS = Object.values(EXPENSE_CATEGORY).map(
    (category) => ({
        label:
            category.split("")[0].toUpperCase() +
            category.substring(1).toLowerCase(),
        value: category,
    }),
);

const EXPENSES_NATURE_OPTIONS = Object.values(EXPENSE_NATURE).map((nature) => ({
    label: nature.split("")[0].toUpperCase() + nature.substring(1),
    value: nature,
}));
const EXPENSES_PAYMENT_METHOD_OPTIONS = Object.values(
    EXPENSE_PAYMENT_METHOD,
).map((method) => ({
    label: method.split("")[0].toUpperCase() + method.substring(1),
    value: method,
}));
const EXPENSES_RECURRING_INTERVAL_OPTIONS = Object.values(
    RECURRING_INTERVAL,
).map((interval) => ({
    label: interval.split("")[0].toUpperCase() + interval.substring(1),
    value: interval,
}));

type NewExpenseFormProps =
    | {
        mode: "CREATE";
    }
    | {
        mode: "EDIT";
        defaultValues: ExpenseUpdateInput;
        action: (payload: EditExpenseSchema) => Promise<ActionResponse<void>>;
    };

const NewExpenseForm = (props: NewExpenseFormProps) => {
    const { mode } = props;
    const { handleAction, loading } = useActionHandler();
    const { closeDialog } = useDialog();
    const form = useForm({
        resolver: zodResolver(expensesBaseSchema),
        defaultValues:
            mode === "CREATE"
                ? {
                    amount: 1,
                    category: "SALARY",
                    expenseDate: startOfToday(),
                    recurringInterval: "MONTHLY",
                    isRecurring: false,
                    description: "",
                    paymentMethod: "CASH",
                    title: "",
                    expenseNature: "FIXED",
                    vendorName: "",
                }
                : props.defaultValues,
    });

    const onSubmit = form.handleSubmit(async (data) => {
        if (mode === "CREATE") {
            await handleAction(createNewExpense, data, {
                onSuccess: () => {
                    form.reset();
                    closeDialog();
                },
            });
        } else {
            await handleAction(
                updateExpense,
                { ...data, id: props.defaultValues.id },
                {
                    onSuccess: () => {
                        form.reset();
                        closeDialog();
                    },
                },
            );
        }
    });

    return (
        <form onSubmit={onSubmit} className="space-y-4 ">
            <FormInput
                name="title"
                label="Expenses Name"
                control={form.control}
                placeholder="e.g. Electricity Bill"
            />
            <FormInput
                name="description"
                label="Description (Optional)"
                control={form.control}
                placeholder="e.g. Monthly electricity bill"
                type="textarea"
                rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    name="category"
                    label="Category"
                    control={form.control}
                    placeholder="Select Category"
                    type="select"
                    options={EXPENSE_CATEGORY_OPTIONS}
                />
                <FormInput
                    name="amount"
                    label="Amount"
                    type="number"
                    control={form.control}
                    placeholder="0"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    name="expenseDate"
                    label="Expenses Date"
                    control={form.control}
                    type="date"
                />
                <FormInput
                    name="expenseNature"
                    label="Nature of Expenses"
                    control={form.control}
                    type="select"
                    options={EXPENSES_NATURE_OPTIONS}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    name="paymentMethod"
                    label="Payment Method"
                    control={form.control}
                    type="select"
                    options={EXPENSES_PAYMENT_METHOD_OPTIONS}
                />
                <FormInput
                    name="vendorName"
                    label="Vendor Name (optional)"
                    control={form.control}
                    placeholder="e.g. Electricity Bill"
                />
            </div>
            <FormInput
                type="switch"
                name="isRecurring"
                control={form.control}
                title="Is this Recurring expense?"
                description="Automatically log this expense every month"
                checked
                icon={<History />}
            />
            <FormInput
                name="recurringInterval"
                label="Recurring Interval"
                control={form.control}
                type="select"
                options={EXPENSES_RECURRING_INTERVAL_OPTIONS}
            />
            <FormButtons
                actionBtnIcon={<Save />}
                actionBtnTitle="Save Expense"
                isLoading={loading}
                loadingText="Saving Expense"
            />
        </form>
    );
};

export default NewExpenseForm;

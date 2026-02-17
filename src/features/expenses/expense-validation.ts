import * as z from "zod";
import {
    EXPENSE_CATEGORY,
    EXPENSE_NATURE,
    EXPENSE_PAYMENT_METHOD,
    RECURRING_INTERVAL,
} from "../../../prisma/generated/prisma/enums";
import { startOfToday } from "date-fns";

export const expensesBaseSchema = z.object({
    title: z
        .string({ error: "Invalid title provided" })
        .min(2, { error: "Title must be at least 2 characters" })
        .max(100, { error: "Title must be at most 100 characters" }),
    amount: z.coerce
        .number({ error: "Invalid amount provided" })
        .min(1, { error: "Amount must be at least 1" })
        .max(10000, { error: "Amount must be at most 10000" }),
    expenseDate: z
        .date({ error: "Invalid date provided" })

        .min(new Date(2022, 0, 1), {
            error: "Date must be at least January 1, 2022",
        })
        .max(startOfToday(), {
            error: "Date must be at most today",
        })
        .default(startOfToday()),
    category: z.enum(EXPENSE_CATEGORY, { error: "Invalid category provided" }),
    paymentMethod: z.enum(EXPENSE_PAYMENT_METHOD, {
        error: "Invalid payment method provided",
    }),
    isRecurring: z.boolean({ error: "Invalid recurring status provided" }),
    recurringInterval: z.enum(RECURRING_INTERVAL, {
        error: "Invalid recurring frequency provided",
    }),
    expenseNature: z.enum(EXPENSE_NATURE, {
        error: "Invalid nature provided",
    }),
    vendorName: z
        .string({ error: "Invalid vendor name provided" })
        .max(100, { error: "Vendor name must be at most 100 characters" })
        .optional(),
    description: z
        .string({ error: "Invalid description provided" })
        .max(500, { error: "Description must be at most 500 characters" })
        .optional(),
});

export const editExpenseSchema = expensesBaseSchema.partial().extend({
    id: z.cuid({ error: "Invalid ID provided" }),
});
export type ExpensesBaseSchema = z.infer<typeof expensesBaseSchema>;
export type CreateExpenseSchema = z.infer<typeof expensesBaseSchema>;
export type EditExpenseSchema = z.infer<typeof editExpenseSchema>;

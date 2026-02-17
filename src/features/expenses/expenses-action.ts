"use server";

import { ActionResponse } from "@/shared/lib/action-response";
import {
    expensesBaseSchema,
    CreateExpenseSchema,
    editExpenseSchema,
    EditExpenseSchema,
} from "./expense-validation";
import { ValidationError } from "@/shared/lib/error-classes";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import prisma from "@/shared/config/prisma.config";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { revalidatePath } from "next/cache";
import { createAuditLog, getAuditMetadata } from "@/shared/lib/server-utils";

export const createNewExpense = async (
    formData: CreateExpenseSchema,
): Promise<ActionResponse<void>> => {
    const { success, data } = expensesBaseSchema.safeParse(formData);
    try {
        if (!success) throw new ValidationError("Invalid form data");
        const currentStaff = await requirePermissionAndReturnUser("expense", [
            "create",
        ]);
        const metadata = await getAuditMetadata();
        prisma.$transaction(async (tx) => {
            const expense = await tx.expense.create({
                data: {
                    amount: data.amount,
                    category: data.category,
                    expenseDate: data.expenseDate,
                    paymentMethod: data.paymentMethod,
                    title: data.title,
                    createdById: currentStaff.id,
                    gymId: currentStaff.gymId,
                    isRecurring: data.isRecurring,
                    expenseNature: data.expenseNature,
                    recurringInterval: data.recurringInterval,
                    vendorName: data.vendorName,
                    description: data.description,
                },
            });
            createAuditLog(
                {
                    action: "CREATE",
                    actorEmail: currentStaff.memberDetails.email || "unknown",
                    actorName: currentStaff.memberDetails.name,
                    entity: "EXPENSE",
                    entityId: expense.id,
                    status: "SUCCESS",
                    actor: {
                        connect: {
                            id: currentStaff.id,
                        },
                    },
                },
                tx, metadata
            );
        });
        revalidatePath("/expenses");
        return {
            type: "SUCCESS",
            message: "Expense created successfully",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

export const updateExpense = async (
    formData: EditExpenseSchema,
): Promise<ActionResponse<void>> => {
    try {
        const { success, data } = editExpenseSchema.safeParse(formData);
        if (!success) throw new ValidationError("Invalid data");
        const currentStaff = await requirePermissionAndReturnUser("expense", [
            "update",
        ]);
        const metadata = await getAuditMetadata();
        await prisma.$transaction([
            prisma.expense.update({

                where: {
                    gymId: currentStaff.organizationId,
                    id: data.id,
                },
                data: {
                    ...data,
                    updatedById: currentStaff.id,
                    updatedAt: new Date(),
                },
            }),
            createAuditLog(
                {
                    action: "UPDATE",
                    actorEmail: currentStaff.memberDetails.email || "unknown",
                    actorName: currentStaff.memberDetails.name,
                    entity: "EXPENSE",
                    entityId: data.id,
                    status: "SUCCESS",
                    actor: {
                        connect: {
                            id: currentStaff.id,
                        },
                    },
                },
                prisma, metadata
            )
        ])
        revalidatePath("/expenses");
        return {
            type: "SUCCESS",
            message: "Expense updated successfully",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

export const deleteExpense = async (
    expenseId: string,
): Promise<ActionResponse<void>> => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("expense", [
            "delete",
        ]);
        const metadata = await getAuditMetadata();

        await prisma.$transaction(async (tx) => {
            const expense = await tx.expense.delete({
                where: {
                    id: expenseId,
                    gymId: currentStaff.organizationId,
                },
            });

            createAuditLog(
                {
                    action: "DELETE",
                    actorEmail: currentStaff.memberDetails.email || "unknown",
                    actorName: currentStaff.memberDetails.name,
                    entity: "EXPENSE",
                    entityId: expense.id,
                    status: "SUCCESS",
                    actor: {
                        connect: {
                            id: currentStaff.id,
                        },
                    },
                },
                tx, metadata
            );
        });

        revalidatePath("/expenses");
        return {
            type: "SUCCESS",
            message: "Expense deleted successfully",
        };
    } catch (error) {
        console.error(error);
        return handleActionError(error);
    }
};

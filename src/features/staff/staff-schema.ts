import * as z from "zod";
import { userSchema } from "../auth/validations/client-validation";
import { Role } from "../../../prisma/generated/prisma/enums";

export const inviteStaffSchema = userSchema
    .pick({
        email: true,
        firstName: true,
        lastName: true,
    })
    .extend({
        role: z.enum([Role.admin, Role.trainer]),
        personalMessage: z
            .string({ error: "Invalid personal message" })
            .min(1, { message: "Personal message is required" })
            .max(255, { message: "Personal message is too long" })
            .optional(),
    });

export const disableStaffAccountSchema = userSchema
    .pick({
        id: true,
    })
    .extend({
        disabledReason: z
            .string({ error: "Invalid reason" })
            .min(1, { message: "Reason is required" })
            .max(255, { message: "Reason is too long" }),
    });
export type InviteStaffSchema = z.infer<typeof inviteStaffSchema>;
export type DisableStaffAccountSchema = z.infer<
    typeof disableStaffAccountSchema
>;

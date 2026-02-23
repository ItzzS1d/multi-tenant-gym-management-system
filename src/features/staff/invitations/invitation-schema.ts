import { userSchema } from "@/features/auth/validations/client-validation";
import * as z from "zod";

export const accepteInvitationSchema = z.object({
    id: z.cuid({ error: "invalid id provied" }),
});
export const createInvitationSchema = userSchema
    .pick({
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        password: true,
    })
    .extend({
        confirmPassword: userSchema.shape.password,
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "password does not match",
                path: ["confirmPassword", "password"],
            });
        }
    });
export const revokeInvitationSchema = accepteInvitationSchema;
export const resendInvitationSchema = accepteInvitationSchema;
export type AccepteInvitationSchema = z.infer<typeof accepteInvitationSchema>;
export type revokeInvitationSchema = z.infer<typeof revokeInvitationSchema>;
export type ResendInvitationSchema = z.infer<typeof resendInvitationSchema>;
export type CreateInvitationSchma = z.infer<typeof createInvitationSchema>;

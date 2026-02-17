import { userSchema } from "@/features/auth/validations/client-validation";
import * as z from "zod";

export const invitationSchema = userSchema
    .pick({
        email: true,
        firstName: true,
        lastName: true,
        password: true,
    })
    .extend({
        confirmPassword: z
            .string()
            .min(8)
            .max(100)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
            ),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
            });
        }
    });
export type InvitationSchema = z.infer<typeof invitationSchema>;

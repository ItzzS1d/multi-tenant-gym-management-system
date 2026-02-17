import * as z from "zod";
import { userSchema } from "../auth/validations/client-validation";
import { PAYMENT_METHOD } from "../../../prisma/generated/prisma/enums";

export const MAX_FILE_SIZE = 1024 * 1024 * 3;
const ACCEPTED_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export const staffNotesSchema = z.object({
    memberId: z.cuid({ error: "Invalid member ID" }),
    content: z
        .string({ error: "Invalid content" })
        .min(1, { message: "Content must be at least 1 character" })
        .max(1000, { message: "Content must be at most 1000 characters" }),
    date: z.date({ error: "Date is required" }).optional(),
});

export const createMemberSchema = userSchema
    .omit({
        password: true,
        id: true,
    })
    .extend({
        membershipPlanId: z.cuid({ error: "Please select a membership plan" }),
        assignedTrainerId: z
            .cuid({ error: "Invalid trainer selected" })
            .nullable()
            .optional(),

        paymentMethod: z.enum(PAYMENT_METHOD, {
            error: "Please select a payment method",
        }),
        amountPaid: z
            .coerce.number({ error: "Invalid amount paid" })
            .min(0)
            .max(50000),
        discount: z
            .coerce.number({ error: "Invalid discount" })
            .min(0)
            .max(5000)
            .nullable()
            .optional(),
        paymentReceivedDate: z.date({
            error: "Payment received date is required",
        }),
        paymentNotes: z
            .string({
                error: "Payment notes are required",
            })
            .optional(),
    })
    .superRefine((data, ctx) => {
        if (data.emergencyPhone === data.phone) {
            ctx.addIssue({
                code: "custom",
                message:
                    "Emergency phone number cannot be the same as member phone number",
                path: ["emergencyPhone"],
            });
        }

        if (!(data.image instanceof File)) {
            ctx.addIssue({
                code: "custom",
                message: "Image file is required",
                path: ["image"],
            });
            return;
        }
        if (data.image.size > MAX_FILE_SIZE) {
            ctx.addIssue({
                code: "custom",
                message: `Max file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
                path: ["image"],
            });
        }
        if (!ACCEPTED_IMAGE_MIME_TYPES.includes(data.image.type)) {
            ctx.addIssue({
                code: "custom",
                message: ".jpg, .jpeg, .png and .webp files are accepted",
                path: ["image"],
            });
        }
    });

export type StaffNotes = z.infer<typeof staffNotesSchema>;
export type CreateMember = z.infer<typeof createMemberSchema>;

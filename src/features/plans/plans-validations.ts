import * as z from "zod";

export const planBaseSchema = z.object({
    name: z
        .string({ error: "Name is required" })
        .min(2, { error: "Name must be at least 2 characters" })
        .max(100, {
            error: "Name must be at most 100 characters",
        }),
    price: z.coerce.number({ error: "Price is required" }).min(0),
    durationInDays: z.coerce
        .number({ error: "Duration is required" })
        .min(1, { error: "Duration must be at least 1 month" })
        .max(36, { error: "Duration must be less than 36 months" }),
    description: z
        .string({ error: "Description is required" })
        .min(2, { error: "Description must be at least 2 characters" })
        .max(1000, { error: "Description must be at most 1000 characters" })
        .nullable(),
    isActive: z.boolean({ error: "Is acquired is required" }),
});
export const togglePlanStatusSchema = planBaseSchema
    .pick({
        isActive: true,
    })
    .extend({
        id: z.cuid({ error: "ID is required" }),
    });

export const createPlanSchema = planBaseSchema;
export const updatePlanSchema = planBaseSchema.partial().extend({
    id: z.cuid({ error: "ID is required" }),
});
export type UpdatePlanSchema = z.infer<typeof updatePlanSchema>;
export type CreatePlanSchema = z.infer<typeof createPlanSchema>;
export type PlanSchema = z.infer<typeof planBaseSchema>;
export type TogglePlanStatusSchema = z.infer<typeof togglePlanStatusSchema>;

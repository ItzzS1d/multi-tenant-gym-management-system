import { TIME_OPTIONS } from "@/shared/constants/time";
import * as z from "zod";

export const onboardingSchema = z.object({
    gymName: z
        .string({ error: "Please enter a gym name" })
        .min(2, {
            error: "Please enter a valid gym name",
        })
        .max(40, {
            error: "Please enter a valid gym name",
        }),
    subDomain: z
        .string({
            error: "Please enter a  site name",
        })
        .min(1, "Site name is required")
        .regex(
            /^[a-z0-9-]+$/,
            "Site name can contain only lowercase letters, numbers, and hyphens",
        ),
    gymAddress: z
        .string({ error: "Please enter a gym address" })
        .min(10, { error: "Please enter a valid address" })
        .max(50, { error: "Please enter a valid address" }),
    openingTime: z.enum(TIME_OPTIONS, {
        error: "Please select a valid opening time",
    }),
    closingTime: z.enum(TIME_OPTIONS, {

        error: "Please select a valid closing time",
    }),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;

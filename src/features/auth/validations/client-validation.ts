import * as z from "zod";
import {
    CONTACT_RELATION,
    GENDER,
} from "../../../../prisma/generated/prisma/enums";

const INDIA_PHONE_REGEX = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export const userSchema = z.object({
    id: z.cuid(),
    email: z
        .email({ error: "Please enter a valid email" })
        .max(255, "Email must be at most 255 characters"),
    image: z.any(),

    firstName: z
        .string({ error: "Please enter a valid first name" })
        .min(2, "First name must be at least 2 characters")
        .max(100, "First name must be at most 100 characters"),
    lastName: z
        .string({ error: "Please enter a valid last name" })
        .min(2, "Last name must be at least 2 characters")
        .max(100, "Last name must be at most 100 characters"),
    phone: z
        .string({ error: "Please enter a valid phone number" })
        .regex(INDIA_PHONE_REGEX, "Please enter a valid phone number"),
    gender: z.enum(GENDER, { error: "Invalid gender" }),
    dob: z.date({ error: "Invalid date of birth" }),
    emergencyName: z
        .string({ error: "Please enter a valid emergency name" })
        .min(2, "Please enter a  emergency name")
        .max(100, "Emergency name must be at most 100 characters"),
    emergencyPhone: z
        .string({ error: "Invalid emergency phone number" })
        .regex(
            INDIA_PHONE_REGEX,
            "Please enter a valid emergency phone number",
        ),
    relationship: z.enum(CONTACT_RELATION, { error: "Invalid relationship" }),
    address: z
        .string({ error: "Please enter a valid address" })
        .min(2, "Please enter a member address")
        .max(255, "Address must be at most 255 characters"),
    startDate: z.coerce
        .date<Date>({ error: "Invalid date received" })
        .refine(
            (d) => d >= new Date(new Date().setHours(0, 0, 0, 0)),
            "Start date must be today or later",
        )
        .default(new Date()),
    password: z
        .string({ error: "Invalid password" })
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 100 characters"),
});
export const loginSchema = userSchema.pick({
    email: true,
    password: true,
});
export const registerSchema = userSchema.pick({
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    password: true,
});
export type UserSchema = z.infer<typeof userSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

"server-only";

import { SomethingWentWrongError } from "@/shared/lib/error-classes";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type SendMailParams = {
    to: string;
    subject: string;
    html: string;
};
export const sendMail = async ({ to, subject, html }: SendMailParams) => {
    try {
        const { error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: ["thekillersd@proton.me"],
            subject,
            html,
        });

        if (error) {
            throw new SomethingWentWrongError("Failed to send email");
        }
        return {
            success: true,
            message: "Please check your email for verification",
        };
    } catch (error: unknown) {
        console.error(error);
        return { success: false, error: "Failed to send email" };
    }
};

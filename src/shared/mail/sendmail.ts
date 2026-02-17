import { sendMail } from "./config";
import {
    RegistrationEmailParams,
    generateRegistrationEmail,
} from "./templates/registration";
import { generateInvitationEmail } from "./templates/invitation";
// import { generatePasswordResetEmail } from "@/mailTemplates/reset-password-mailTemplate";

// export async function sendForGotPasswordMail(to: string, link: string) {
//   const subject = "Password reset request";
//   const html = generatePasswordResetEmail({ resetLink: link });
//   await sendMail(to, subject, html);
// }

export async function sendSignupVerificationCode(
    params: RegistrationEmailParams,
    to: string,
) {
    const subject = "Verify Email";
    const html = generateRegistrationEmail(params);
    await sendMail({ to, subject, html });
}

export async function sendOnboardingLink(to: string, url: string) {
    const subject = "sendOnboardingLink";
    const html = `
        <h1>OnboardingLink</h1>
        <p>Click <a href="${url}">here</a> to Verify your email</p>
        `;
    await sendMail({
        to,
        subject,
        html,
    });
}
export async function sendResetPasswordLink(to: string, url: string) {
    const subject = "Reset Password";
    const html = `
        <h1>Reset Password</h1>
        <p>Click <a href="${url}">here</a> to reset your password</p>
        `;
    await sendMail({
        to,
        subject,
        html,
    });
}
export async function passwordResetConfirmationMail(to: string) {
    const subject = "Password Reset Confirmation";
    const date = new Date();
    const html = `
        <h1>Password Reset Confirmation</h1>
        <p>your password has been reset successfully on ${date}</p>
        `;
    await sendMail({
        to,
        subject,
        html,
    });
}
interface sendInvitationEmail {
    email: string;
    invitedByUsername: string;
    invitedByEmail: string;
    gymName: string;
    inviteLink: string;
    primaryColor?: string;
}
export async function sendInvitationEmail({
    email,
    invitedByUsername,
    invitedByEmail,
    gymName,
    inviteLink,
    primaryColor,
}: sendInvitationEmail) {
    const subject = `Invitaion to join ${gymName}`;
    const html = generateInvitationEmail({
        invitedByUsername,
        invitedByEmail,
        teamName: gymName,
        inviteLink,
        primaryColor,
    });
    try {
        await sendMail({
            to: email,
            subject,
            html,
        });
    } catch (error) {
        console.error(error);
    }
}

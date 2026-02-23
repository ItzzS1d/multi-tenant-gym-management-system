"server-only";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";
import prisma from "./prisma.config";
import {
    createAuthMiddleware,
    haveIBeenPwned,
    organization,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import {
    ac,
    admin,
    god,
    member,
    owner,
    trainer,
} from "@/shared/constants/better-auth-roles";
import { sendSignupVerificationCode } from "@/shared/mail";
import {
    passwordResetConfirmationMail,
    sendInvitationEmail,
    sendResetPasswordLink,
} from "@/shared/mail/sendmail";
import { getActiveOrganization } from "@/shared/lib/tenant";
import { setCookie } from "../lib/cookie-util";
import { APIError } from "better-auth";
import { protocol } from "@/shared/lib/utils";
import { ALL_EMAIL_DOMAINS, rootDomain } from "../lib/server-utils";

// const rootDomain =
//     process.env.NODE_ENV === "development"
//         ? `${process.env.BETTER_AUTH_DOMAIN}:3000`
//         : process.env.BETTER_AUTH_DOMAIN;
const trustedOrigins = [
    `${protocol}://${rootDomain}`,
    `${protocol}://*.${rootDomain}`,
];

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    rateLimit: {
        window: 60,
        max: 100,
    },

    trustedOrigins: trustedOrigins,
    plugins: [
        organization({
            requireEmailVerificationOnInvitation: false,
            async sendInvitationEmail({ id, email, inviter, organization }) {
                const inviteLink = `${protocol}://${rootDomain}/staff/accept-invitation/${id}`;
                let primaryColor;
                if (organization.metadata) {
                    try {
                        const meta =
                            typeof organization.metadata === "string"
                                ? JSON.parse(organization.metadata)
                                : organization.metadata;
                        primaryColor = meta.primaryColor;
                    } catch (e) {}
                }

                // sendInvitationEmail({
                //     email,
                //     inviteLink,
                //     invitedByEmail: inviter.user.email,
                //     gymName: organization.name,
                //     invitedByUsername: inviter.user.name,
                //     primaryColor,
                // });
                console.info(inviteLink);
            },
            ac,
            roles: {
                owner,
                admin,
                member,
                trainer,
                god,
            },
            schema: {
                invitation: {
                    additionalFields: {
                        firstName: {
                            type: "string",
                            input: true,
                            required: true,
                        },
                        lastName: {
                            type: "string",
                            input: true,
                            required: true,
                        },
                        personalMessage: {
                            type: "string",
                            input: true,
                            required: false,
                        },
                    },
                },

                member: {
                    modelName: "GymMember",

                    fields: {
                        organizationId: "gymId",
                    },
                    additionalFields: {
                        updatedAt: {
                            type: "date",
                            input: true,
                            required: false,
                        },

                        isActive: {
                            type: "boolean",
                            input: true,
                            required: false,
                        },
                    },
                },

                organization: {
                    modelName: "Gym",

                    additionalFields: {
                        address: {
                            type: "string",
                            input: true,
                            required: true,
                        },
                        openingTime: {
                            type: "string",
                            input: true,
                            required: true,
                        },

                        closingTime: {
                            type: "string",
                            input: true,
                            required: true,
                        },
                    },
                },
            },
        }),
        // haveIBeenPwned({
        //     customPasswordCompromisedMessage:
        //         "We have detected that your password has been compromised in a data breach. Please choose a stronger password.",
        // }),
        nextCookies(),
    ],

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        disableSignUp: false,
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 5 * 60,
        async sendResetPassword({ user, url }) {
            void sendResetPasswordLink(user.email, url);
        },
        onPasswordReset: async ({ user }) => {
            void passwordResetConfirmationMail(user.email);
        },
    },

    emailVerification: {
        autoSignInAfterVerification: true,
        expiresIn: 5 * 60, // 5 minutes
        sendOnSignUp: true,
        sendOnSignIn: true,
        sendVerificationEmail: async ({ user, url }) => {
            console.info(url);

            // sendSignupVerificationCode(
            //     { name: user.name, verificationLink: url },
            //     user.email,
            // );
        },
        afterEmailVerification: async () => {
            setCookie({
                message: "Account verified! Let’s get started.",
                type: "success",
            });
        },
    },

    advanced: {
        database: {
            generateId: false,
        },
        defaultCookieAttributes: {
            sameSite: "Lax",
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
        },
        useSecureCookies: process.env.NODE_ENV !== "development",
        cookiePrefix: "SID",
        crossSubDomainCookies: {
            enabled: process.env.NODE_ENV !== "development",
            domain:
                process.env.NODE_ENV === "development"
                    ? undefined
                    : `.${rootDomain}`,
        },
    },
    user: {
        additionalFields: {
            phone: {
                type: "string",
                default: "",
                input: true,
            },
            hasCompletedOnboarding: {
                type: "boolean",
                default: false,
                input: false,
            },
            isBanned: {
                type: "boolean",
                default: false,
                input: false,
            },
        },
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-up/email") {
                const { email } = ctx.body;
                if (!email) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Invalid email address",
                    });
                }
                const isAllowed = ALL_EMAIL_DOMAINS.some((domain) =>
                    email.endsWith(domain.toLowerCase()),
                );
                // if (!isAllowed) {
                //     throw new APIError("BAD_REQUEST", {
                //         message: "Email address not allowed",
                //     });
                // }
            }
            if (ctx.path === "/sign-in/email") {
                const { email } = ctx.body;
                const user = await prisma.user.findUnique({
                    where: { email },
                    select: { isBanned: true, id: true },
                });

                if (user && user.isBanned) {
                    return ctx.error("FORBIDDEN", {
                        message:
                            "Your account has been suspended. Please contact support.",
                    });
                }
                const member = await prisma.gymMember.findFirst({
                    where: {
                        userId: user?.id,
                    },
                    select: {
                        isActive: true,
                    },
                });
                if (!member?.isActive) {
                    return ctx.error("FORBIDDEN", {
                        message:
                            "Your account has been disabled. Please contact gym administrator.",
                    });
                }
            }
        }),
    },
    databaseHooks: {
        session: {
            create: {
                async before(session) {
                    const activeOrg = await getActiveOrganization(
                        session?.userId,
                    );

                    return {
                        data: {
                            ...session,
                            activeOrganizationId: activeOrg?.gymId,
                        },
                    };
                },
            },
        },
    },
    session: {
        cookieCache: {
            enabled: true,
        },
    },
});

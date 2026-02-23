"server-only";

import { headers } from "next/headers";
import { Prisma, PrismaClient } from "../../../prisma/generated/prisma/client";
import prisma from "../config/prisma.config";
import { protocol } from "./utils";
import { Route } from "next";

export const ALL_EMAIL_DOMAINS = [
    "@gmail.com",
    "@yahoo.com",
    "@outlook.com",
    "@justzeus.com",
    "@proton.me",
] as const;

export async function getAuditMetadata() {
    const headersList = await headers();
    let ip = headersList.get("x-forwarded-for") || "Unknown";
    const userAgent = headersList.get("user-agent") || "Unknown";
    if (ip === "::1") {
        ip = "127.0.0.1";
    }
    return { ipAddress: ip, userAgent };
}
export function createAuditLog(
    auditLog: Omit<Prisma.AuditLogCreateInput, "ipAddress" | "userAgent">,
    db: Prisma.TransactionClient | PrismaClient,
    metadata: Awaited<ReturnType<typeof getAuditMetadata>>,
) {
    return db.auditLog.create({
        data: {
            ...auditLog,
            ...metadata,
            changes: auditLog.changes ?? Prisma.DbNull,
        },
    });
}

export async function createAuthLog(
    data: Omit<Prisma.SecurityLogCreateInput, "ipAddress" | "userAgent">,
    trx?: Prisma.TransactionClient,
) {
    const headersList = await headers();
    let ip = headersList.get("x-forwarded-for") || "Unknown";
    const userAgent = headersList.get("user-agent") || "Unknown";

    if (ip === "::1") {
        ip = "127.0.0.1";
    }
    if (!trx) {
        return prisma.securityLog.create({
            data: {
                ...data,
                ipAddress: ip,
                userAgent,
            },
        });
    }
    await trx.securityLog.create({
        data: {
            ...data,
            ipAddress: ip,
            userAgent,
        },
    });
}

export function VALID_DOMAIN() {
    const validDomains = ["gmail.com", "yahoo.com", "outlook.com", ""];

    return validDomains;
}

export const rootDomain =
    process.env.NODE_ENV === "development"
        ? `${process.env.BETTER_AUTH_DOMAIN}:3000`
        : process.env.BETTER_AUTH_DOMAIN!;
export const rootDomainWithProtocol = `${protocol}://${rootDomain}`;
export const constructUrl = (pathName: string, subDomain: string) => {
    return `${protocol}://${subDomain}.${rootDomain}${pathName}` as Route;
};

"server-only";
import { auth } from "@/shared/config/auth.config";
import { Actions, Resources } from "@/shared/constants/better-auth-roles";
import prisma from "../config/prisma.config";
import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import {
    UnauthorizedError,
    ForbiddenError,
    NoOrganizationError,
    ValidationError,
} from "./error-classes";

export const requireUser = cache(async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return redirect("/login");
    if (session.user.isBanned) throw new UnauthorizedError();

    return session;
});

export const currentMember = cache(async () => {
    const member = await auth.api.getActiveMember({ headers: await headers() });
    if (!member) throw new UnauthorizedError();
    if (!member.organizationId) throw new NoOrganizationError();

    if (!member.isActive) {
        return null;
    }

    // CRITICAL SECURITY: Validate member belongs to current subdomain's gym
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const subdomain = host.split(".")[0].replace(/:3000$/, ""); // Remove port in dev

    // Get the gym for this subdomain
    const gym = await prisma.gym.findUnique({
        where: { slug: subdomain },
        select: { id: true },
    });

    // Verify member's gym matches current subdomain
    if (gym && member.organizationId !== gym.id) {
        throw new ForbiddenError();
    }

    return member;
});
export const currentRole = cache(async () => {
    const res = await currentMember();
    if (!res?.role) throw new UnauthorizedError();
    return res.role;
});

export const requireActiveOrganization = cache(async () => {
    const member = await currentMember();
    if (!member) throw new UnauthorizedError();
    return member.organizationId;
});

export const requirePermissionAndReturnUser = cache(
    async (resource: Resources, action: Actions[]) => {
        const currentMemberInfo = await currentMember();
        const member = await prisma.gymMember.findFirst({
            where: {
                gymId: currentMemberInfo?.organizationId,
                userId: currentMemberInfo?.userId,
                isActive: true,
                role: {
                    in: ["admin", "god", "owner", "trainer"],
                },
            },
            select: {
                id: true,
                userId: true,
                gymId: true,
                isActive: true,
                role: true,
                memberDetails: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        const { success } = await auth.api.hasPermission({
            headers: await headers(),
            body: { permissions: { [resource]: action } },
        });

        if (!success) throw new ForbiddenError();
        if (!member || !member?.isActive) throw new ForbiddenError();

        return {
            ...member,
            organizationId: member.gymId,
            memberDetails: {
                ...member.memberDetails,
                name:
                    member.memberDetails?.firstName +
                    " " +
                    member.memberDetails?.lastName,
            },
        };
    },
);
export const assertPermission = cache(
    async (resource: Resources, action: Actions[]) => {
        const { success } = await auth.api.hasPermission({
            headers: await headers(),
            body: { permissions: { [resource]: action } },
        });
        if (!success) throw new ForbiddenError();
    },
);

export const isAuthenticated = cache(async () => {
    const user = await auth.api.getSession({
        headers: await headers(),
    });
    return !!user;
});

export const getActiveMemberRole = cache(async () => {
    try {
        return await currentRole();
    } catch (e: unknown) {
        return null;
    }
});

export const banUserAndRevokeSessions = async (targetUserId: string) => {
    const caller = await requireUser();
    if (!caller) throw new UnauthorizedError();

    await prisma.user.update({
        where: { id: targetUserId },
        data: { isBanned: true },
    });

    await prisma.session.deleteMany({
        where: { userId: targetUserId },
    });
};

export const disableMemberAndRevokeSessions = async (
    gymMemberId: string,
    gymId: string,
) => {
    const caller = await currentMember();
    if (!caller) throw new UnauthorizedError();

    const gymMember = await prisma.gymMember.findUnique({
        where: { id: gymMemberId, gymId },
        select: { userId: true },
    });

    if (!gymMember) throw new ValidationError("Member not found");

    await prisma.gymMember.update({
        where: { id: gymMemberId, gymId },
        data: { isActive: false },
    });

    await prisma.session.deleteMany({
        where: { userId: gymMember.userId },
    });
};
// does not throw redirect error and this will be user to get user information use this only if already auth check is happing on layout file
export const currentUser = cache(async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    return session as NonNullable<typeof session>;
});

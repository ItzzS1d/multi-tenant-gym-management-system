"use server";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import {
    CreateMember,
    createMemberSchema,
    RenewMember,
    renewMemberSchema,
    StaffNotes,
    staffNotesSchema,
    UpdateMember,
    updateMemberSchema,
    AssignTrainer,
    assignTrainerSchema,
} from "../member-validations";
import prisma from "@/shared/config/prisma.config";
import { ValidationError } from "@/shared/lib/error-classes";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { ActionResponse } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { createAuditLog, getAuditMetadata } from "@/shared/lib/server-utils";
import { addDays, endOfDay } from "date-fns";

import { normalizeName } from "@/shared/lib/utils";
import { Role } from "../../../../prisma/generated/prisma/enums";
// getTrainersList action wrapper removed, use API route instead

export const getMemberForEdit = async (memberId: string) => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "read",
        ]);

        const member = await prisma.gymMember.findUnique({
            where: {
                id: memberId,
                gymId: currentStaff.organizationId,
            },
            select: {
                id: true,
                assignedTrainerId: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                memberDetails: {
                    select: {
                        gender: true,
                        address: true,
                        emergencyName: true,
                        emergencyPhone: true,
                        relationship: true,
                        dob: true,
                        image: true,
                    },
                },
            },
        });

        if (!member) return null;

        return {
            id: member.id,
            firstName: normalizeName(member.user.name, "first"),
            lastName: normalizeName(member.user.name, "last"),
            email: member.user.email,
            phone: member.user.phone,
            gender: member.memberDetails?.gender,
            dob: member.memberDetails?.dob,
            address: member.memberDetails?.address,
            emergencyName: member.memberDetails?.emergencyName,
            emergencyPhone: member.memberDetails?.emergencyPhone,
            relationship: member.memberDetails?.relationship,
            assignedTrainerId: member.assignedTrainerId,
            image: member.memberDetails?.image,
        };
    } catch (error) {
        console.error("Error in getMemberForEdit:", error);
        return null;
    }
};

export const addNewNoteAction = async (
    formData: Omit<StaffNotes, "id">,
): Promise<ActionResponse<void>> => {
    const { success, data } = staffNotesSchema.safeParse(formData);

    try {
        if (!success) throw new ValidationError("Invalid data");
        const member = await requirePermissionAndReturnUser("notes", [
            "create",
        ]);
        await prisma.staffNote.create({
            data: {
                content: data.content,
                gymId: member.organizationId,
                staffId: member.id,
                memberId: formData.memberId,
            },
        });
        revalidatePath("/staff");
        return {
            message: "Note added successfully",
            type: "SUCCESS",
            showNotification: false,
        };
    } catch (error) {
        return handleActionError(error);
    }
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createNewMemberAction = async (
    formData: CreateMember,
): Promise<ActionResponse<void>> => {
    const { success, data } = createMemberSchema.safeParse(formData);

    let uploadedPublicId: string | null = null;

    try {
        if (!success) throw new ValidationError("Invalid  data");
        const currentMember = await requirePermissionAndReturnUser("member", [
            "create",
        ]);

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const publicId =
            `${data.firstName}-${data.lastName}-${uniqueSuffix}`.toLowerCase();

        const file = data.image as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const imageUploadRes = await cloudinary.uploader.upload(base64, {
            folder: `gym/${currentMember.organizationId}/members`,
            resource_type: "image",
            public_id: publicId,
            overwrite: true,
            transformation: [
                {
                    width: 500,
                    height: 500,
                    crop: "fill",
                    gravity: "face",
                    quality: "auto",
                    fetch_format: "auto",
                },
            ],
        });

        uploadedPublicId = imageUploadRes.public_id;
        const metadata = await getAuditMetadata();
        await prisma.$transaction(async (tx) => {
            if (data.assignedTrainerId) {
                const trainer = await tx.gymMember.findFirst({
                    where: {
                        id: data.assignedTrainerId,
                        gymId: currentMember.organizationId,
                        role: "trainer",
                    },
                });
                if (!trainer) {
                    throw new Error("Invalid form data");
                }
            }
            const plan = await tx.plan.findFirst({
                where: {
                    id: data.membershipPlanId,
                    gymId: currentMember.organizationId,
                    isActive: true,
                },
            });
            if (!plan) {
                throw new Error("Invalid form data");
            }
            const expirationDate = addDays(data.startDate, plan.durationInDays);
            const expirationDateEndOfDay = endOfDay(expirationDate);
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    phone: data.phone,
                    name: `${data.firstName} ${data.lastName}`,
                    emailVerified: false,
                },
            });
            const member = await tx.gymMember.create({
                data: {
                    gymId: currentMember.organizationId,
                    role: "member",
                    assignedTrainerId: data.assignedTrainerId,
                    isActive: true,
                    userId: user.id,

                    memberDetails: {
                        create: {
                            gender: data.gender,
                            address: data.address,
                            emergencyName: data.emergencyName,
                            emergencyPhone: data.emergencyPhone,
                            relationship: data.relationship,
                            dob: data.dob,
                            image: imageUploadRes.secure_url,
                        },
                    },
                    memberPlans: {
                        create: {
                            gymId: currentMember.organizationId,
                            planId: plan.id,
                            startDate: data.startDate,
                            endDate: expirationDateEndOfDay,
                            status: "ACTIVE",
                            planDurationSnapshot: plan.durationInDays,
                            planNameSnapshot: plan.name,
                            planPriceSnapshot: plan.price,
                        },
                    },
                },
                include: {
                    memberPlans: true,
                },
            });

            const memberRecord = member.memberPlans[0];

            await tx.payment.create({
                data: {
                    amountPaid: plan.price,
                    gymId: currentMember.organizationId,
                    method: data.paymentMethod,
                    gymMemberId: member.id,
                    paymentReceivedDate: new Date(),
                    memberPlanId: memberRecord.id,
                },
            });

            await createAuditLog(
                {
                    action: "CREATE",
                    actorEmail: currentMember.user.email || "",
                    actorName: currentMember.user.name,
                    entity: "MEMBER",
                    status: "SUCCESS",
                    entityId: member.id,
                    actor: {
                        connect: {
                            id: currentMember.id,
                        },
                    },

                    gym: {
                        connect: {
                            id: currentMember.organizationId,
                        },
                    },
                },
                tx,
                metadata,
            );
        });

        return { type: "SUCCESS", message: "Member created successfully" };
    } catch (error) {
        if (uploadedPublicId) {
            await cloudinary.uploader.destroy(uploadedPublicId);
        }
        console.error("Action Error:", error);

        return handleActionError(error);
    }
};
export const renewMembershipAction = async (
    formData: RenewMember,
): Promise<ActionResponse<void>> => {
    const { success, data } = renewMemberSchema.safeParse(formData);

    try {
        if (!success) throw new ValidationError("Invalid data");
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "update",
        ]);

        const metadata = await getAuditMetadata();

        await prisma.$transaction(async (tx) => {
            const plan = await tx.plan.findFirst({
                where: {
                    id: data.membershipPlanId,
                    gymId: currentStaff.organizationId,
                    isActive: true,
                },
            });

            if (!plan) throw new Error("Invalid plan");

            const expirationDate = addDays(data.startDate, plan.durationInDays);
            const expirationDateEndOfDay = endOfDay(expirationDate);

            // Deactivate existing active plans if
            await tx.memberPlan.updateMany({
                where: {
                    gymMemberId: data.memberId,
                    status: "ACTIVE",
                },
                data: {
                    status: "EXPIRED",
                },
            });

            const newPlan = await tx.memberPlan.create({
                data: {
                    gymId: currentStaff.organizationId,
                    gymMemberId: data.memberId,
                    planId: plan.id,
                    startDate: data.startDate,
                    endDate: expirationDateEndOfDay,
                    status: "ACTIVE",
                    planDurationSnapshot: plan.durationInDays,
                    planNameSnapshot: plan.name,
                    planPriceSnapshot: plan.price,
                },
            });

            await tx.payment.create({
                data: {
                    amountPaid: data.amountPaid,
                    gymId: currentStaff.organizationId,
                    method: data.paymentMethod,
                    gymMemberId: data.memberId,
                    paymentReceivedDate: new Date(),
                    memberPlanId: newPlan.id,
                    notes: data.paymentNotes,
                },
            });

            await createAuditLog(
                {
                    action: "UPDATE",
                    actorEmail: currentStaff.user.email || "",
                    actorName: currentStaff.user.name,
                    entity: "MEMBER",
                    status: "SUCCESS",
                    entityId: data.memberId,
                    actor: { connect: { id: currentStaff.id } },
                    gym: { connect: { id: currentStaff.organizationId } },
                },
                tx,
                metadata,
            );
        });

        revalidatePath("/members");
        return { type: "SUCCESS", message: "Membership renewed successfully" };
    } catch (error) {
        return handleActionError(error);
    }
};

export const toggleMemberStatusAction = async ({
    memberId,
    isActive,
}: {
    memberId: string;
    isActive: boolean;
}): Promise<ActionResponse<void>> => {
    try {
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "update",
        ]);

        const metadata = await getAuditMetadata();

        await prisma.$transaction(async (tx) => {
            await tx.gymMember.update({
                where: { id: memberId, gymId: currentStaff.organizationId },
                data: { isActive },
            });

            await createAuditLog(
                {
                    action: "UPDATE",
                    actorEmail: currentStaff.user.email || "",
                    actorName: currentStaff.user.name,
                    entity: "MEMBER",
                    status: "SUCCESS",
                    entityId: memberId,
                    actor: { connect: { id: currentStaff.id } },
                    gym: { connect: { id: currentStaff.organizationId } },
                },
                tx,
                metadata,
            );
        });

        revalidatePath("/members");
        return {
            type: "SUCCESS",
            message: `Member ${isActive ? "activated" : "suspended"} successfully`,
        };
    } catch (error) {
        return handleActionError(error);
    }
};
export const updateMemberAction = async (
    memberId: string,
    formData: UpdateMember,
): Promise<ActionResponse<void>> => {
    const { success, data } = updateMemberSchema.safeParse(formData);

    let uploadedPublicId: string | null = null;

    try {
        if (!success) throw new ValidationError("Invalid data");
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "update",
        ]);

        const metadata = await getAuditMetadata();

        await prisma.$transaction(async (tx) => {
            const existingMember = await tx.gymMember.findUnique({
                where: { id: memberId, gymId: currentStaff.organizationId },
                include: { user: true, memberDetails: true },
            });

            if (!existingMember) throw new Error("Member not found");

            let imageUrl = existingMember.memberDetails?.image;

            if (data.image instanceof File) {
                const uniqueSuffix =
                    Date.now() + "-" + Math.round(Math.random() * 1e9);
                const publicId =
                    `${data.firstName}-${data.lastName}-${uniqueSuffix}`.toLowerCase();

                const arrayBuffer = await data.image.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const base64 = `data:${data.image.type};base64,${buffer.toString("base64")}`;

                const imageUploadRes = await cloudinary.uploader.upload(
                    base64,
                    {
                        folder: `gym/${currentStaff.organizationId}/members`,
                        resource_type: "image",
                        public_id: publicId,
                        overwrite: true,
                        transformation: [
                            {
                                width: 500,
                                height: 500,
                                crop: "fill",
                                gravity: "face",
                                quality: "auto",
                                fetch_format: "auto",
                            },
                        ],
                    },
                );
                imageUrl = imageUploadRes.secure_url;
                uploadedPublicId = imageUploadRes.public_id;

                // Optionally delete old image from cloudinary if it exists
                if (existingMember.memberDetails?.image) {
                    const oldPublicId = existingMember.memberDetails.image
                        .split("/")
                        .pop()
                        ?.split(".")[0];
                    if (oldPublicId && !oldPublicId.includes("default")) {
                        // await cloudinary.uploader.destroy(oldPublicId);
                    }
                }
            }

            await tx.user.update({
                where: { id: existingMember.userId },
                data: {
                    email: data.email,
                    phone: data.phone,
                    name: `${data.firstName} ${data.lastName}`,
                },
            });

            await tx.gymMember.update({
                where: { id: memberId },
                data: {
                    assignedTrainerId: data.assignedTrainerId,
                    memberDetails: {
                        update: {
                            gender: data.gender,
                            address: data.address,
                            emergencyName: data.emergencyName,
                            emergencyPhone: data.emergencyPhone,
                            relationship: data.relationship,
                            dob: data.dob,
                            image: imageUrl,
                        },
                    },
                },
            });

            await createAuditLog(
                {
                    action: "UPDATE",
                    actorEmail: currentStaff.user.email || "",
                    actorName: currentStaff.user.name,
                    entity: "MEMBER",
                    status: "SUCCESS",
                    entityId: memberId,
                    actor: { connect: { id: currentStaff.id } },
                    gym: { connect: { id: currentStaff.organizationId } },
                },
                tx,
                metadata,
            );
        });

        revalidatePath("/members");
        revalidatePath(`/members/${memberId}`);
        return { type: "SUCCESS", message: "Member updated successfully" };
    } catch (error) {
        if (uploadedPublicId) {
            await cloudinary.uploader.destroy(uploadedPublicId);
        }
        return handleActionError(error);
    }
};

export const assignTrainerAction = async (
    formData: AssignTrainer,
): Promise<ActionResponse<void>> => {
    const { success, data } = assignTrainerSchema.safeParse(formData);
    try {
        if (!success) throw new ValidationError("Invalid data");
        const { memberId, trainerId } = data;
        const currentStaff = await requirePermissionAndReturnUser("member", [
            "update",
        ]);

        const metadata = await getAuditMetadata();

        await prisma.$transaction(async (tx) => {
            const members = await tx.gymMember.findMany({
                where: {
                    id: {
                        in: [memberId, trainerId].filter(Boolean),
                    },
                    gymId: currentStaff.organizationId,
                },
            });

            const targetMember = members.find((m) => m.id === memberId);

            if (!targetMember)
                throw new Error("Member not found in this organization");

            if (targetMember.role !== "member")
                throw new Error("Target record is not a member");

            if (trainerId) {
                const trainer = members.find((m) => m.id === trainerId);

                if (!trainer)
                    throw new Error(
                        "The selected trainer record is invalid or from another gym",
                    );

                if (trainer.role !== "trainer")
                    throw new Error("Selected user is not a trainer");
            }

            await tx.gymMember.update({
                where: { id: memberId },
                data: { assignedTrainerId: trainerId ?? null },
            });

            await createAuditLog(
                {
                    action: "UPDATE",
                    actorEmail: currentStaff.user.email || "",
                    actorName: currentStaff.user.name,
                    entity: "MEMBER",
                    status: "SUCCESS",
                    entityId: memberId,
                    actor: { connect: { id: currentStaff.id } },
                    gym: { connect: { id: currentStaff.organizationId } },
                },
                tx,
                metadata,
            );
        });

        revalidatePath("/members");
        revalidatePath(`/members/${memberId}`);
        return { type: "SUCCESS", message: "Trainer assigned successfully" };
    } catch (error) {
        return handleActionError(error);
    }
};

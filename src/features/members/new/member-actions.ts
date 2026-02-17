"use server";
import { requirePermissionAndReturnUser } from "@/shared/lib/session";
import {
    CreateMember,
    createMemberSchema,
    StaffNotes,
    staffNotesSchema,
} from "../member-validations";
import prisma from "@/shared/config/prisma.config";
import { ValidationError } from "@/shared/lib/error-classes";
import { handleActionError } from "@/shared/lib/handle-action-error";
import { ActionResponse } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { createAuditLog, getAuditMetadata } from "@/shared/lib/server-utils";
import { headers } from "next/headers";
import { addDays, endOfDay } from "date-fns";

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
        const metadata = await getAuditMetadata()
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
            const expirationDate = addDays(new Date(), plan.durationInDays);
            const expirationDateEndOfDay = endOfDay(expirationDate);
            const member = await tx.gymMember.create({
                data: {
                    gymId: currentMember.organizationId,
                    role: "member",
                    assignedTrainerId: data.assignedTrainerId,
                    isActive: true,
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

                    memberDetails: {
                        create: {
                            gender: data.gender,
                            address: data.address,
                            emergencyName: data.emergencyName,
                            emergencyPhone: data.emergencyPhone,
                            relationship: data.relationship,
                            dob: data.dob,
                            email: data.email,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            phone: data.phone,
                            image: imageUploadRes.secure_url,
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
                    actorEmail: currentMember?.memberDetails.email || "",
                    actorName: currentMember.memberDetails.name,
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
                tx, metadata
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

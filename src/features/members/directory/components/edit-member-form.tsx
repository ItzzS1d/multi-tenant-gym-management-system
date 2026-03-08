"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/shared/components/ui/form-input";
import FormButtons from "@/shared/components/dialog/form-btn";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { useDialog } from "@/shared/hooks/useDialog";
import useSWR from "swr";
import { getMemberForEdit, updateMemberAction } from "../../new/member-actions";
import { updateMemberSchema, UpdateMember } from "../../member-validations";
import {
    CONTACT_RELATION,
    GENDER,
} from "../../../../../prisma/generated/prisma/enums";
import { Save, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { Spinner } from "@/shared/components/ui/spinner";

interface EditMemberFormProps {
    memberId: string;
}

const EditMemberForm = ({ memberId }: EditMemberFormProps) => {
    const { handleAction, loading: isSaving } = useActionHandler();
    const { closeDialog } = useDialog();
    const [preview, setPreview] = useState<string | File | null>(null);

    const {
        data: member,
        isLoading,
        error,
    } = useSWR(memberId, getMemberForEdit);

    const form = useForm<UpdateMember>({
        resolver: zodResolver(updateMemberSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            gender: "MALE",
            dob: new Date(),
            address: "",
            emergencyName: "",
            emergencyPhone: "",
            relationship: "FRIEND",
            image: "",
        },
    });

    useEffect(() => {
        if (member) {
            form.reset({
                firstName: member.firstName || "",
                lastName: member.lastName || "",
                email: member.email || "",
                phone: member.phone || "",
                gender: (member.gender as GENDER) || "MALE",
                dob: member.dob ? new Date(member.dob) : new Date(),
                address: member.address || "",
                emergencyName: member.emergencyName || "",
                emergencyPhone: member.emergencyPhone || "",
                relationship:
                    (member.relationship as CONTACT_RELATION) || "FRIEND",
                image: member.image || "",
            });
            setPreview(member.image || null);
        }
    }, [member, form]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setPreview(file);
        form.setValue("image", file);
    };

    const onSubmit = form.handleSubmit(async (data: UpdateMember) => {
        await handleAction(updateMemberAction.bind(null, memberId), data, {
            onSuccess() {
                closeDialog();
            },
        });
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Spinner className="h-8 w-8  text-primary" />
                <p className="text-sm text-gray-500 font-medium">
                    Loading member details...
                </p>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="text-center py-12 text-red-500 font-medium">
                Failed to load member details. Please try again.
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6  pt-4">
            <div className="flex flex-col items-center gap-3">
                <div
                    className={cn(
                        "relative group cursor-pointer w-24 h-24 rounded-full bg-[#f8fcf9] dark:bg-[#102216] border-2 border-dashed border-[#cfe7d7] dark:border-[#2d4a35] flex items-center justify-center hover:border-primary transition-colors duration-200",
                        form.formState.errors.image && "border-red-500",
                    )}
                >
                    {preview ? (
                        <Image
                            src={
                                typeof preview === "string"
                                    ? preview
                                    : URL.createObjectURL(preview)
                            }
                            alt="Preview"
                            fill
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <div className="flex flex-col items-center text-[#4c9a66]">
                            <ImagePlus size={24} />
                            <span className="text-[10px] mt-1 font-medium">
                                Upload
                            </span>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                    />
                </div>
                <p className="text-[10px] text-gray-500">
                    Profile Photo (Max 3MB)
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 px-4 gap-4">
                <FormInput
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    placeholder="First name"
                />
                <FormInput
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Last name"
                />
                <FormInput
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Email"
                />
                <FormInput
                    control={form.control}
                    name="phone"
                    label="Phone"
                    placeholder="Phone"
                />
                <FormInput
                    control={form.control}
                    name="dob"
                    label="Date of Birth"
                    type="date"
                />
                <FormInput
                    control={form.control}
                    name="gender"
                    label="Gender"
                    type="select"
                    options={[
                        { label: "Male", value: "MALE" },
                        { label: "Female", value: "FEMALE" },
                        { label: "Other", value: "OTHER" },
                    ]}
                />
                <FormInput
                    control={form.control}
                    name="relationship"
                    label="Emergency Relationship"
                    type="select"
                    options={Object.values(CONTACT_RELATION).map((value) => ({
                        value,
                        label: value.charAt(0) + value.slice(1).toLowerCase(),
                    }))}
                />
                <FormInput
                    control={form.control}
                    name="emergencyName"
                    label="Emergency Name"
                    placeholder="Emergency contact name"
                />
                <FormInput
                    control={form.control}
                    name="emergencyPhone"
                    label="Emergency Phone"
                    placeholder="Emergency contact phone"
                />
            </div>

            <div className="col-span-1 md:col-span-2 px-4">
                <FormInput
                    control={form.control}
                    name="address"
                    label="Address"
                    type="textarea"
                    placeholder="Residential address"
                />
            </div>

            <FormButtons
                actionBtnIcon={<Save size={18} />}
                actionBtnTitle="Save Changes"
                isLoading={isSaving}
                loadingText="Saving..."
            />
        </form>
    );
};

export default EditMemberForm;

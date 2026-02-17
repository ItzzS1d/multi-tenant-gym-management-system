"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { inviteStaffSchema } from "../staff-schema";
import FormInput from "@/shared/components/ui/form-input";
import { Mail, SendHorizonal, UserCircle } from "lucide-react";
import { Role } from "../../../../prisma/generated/prisma/enums";
import FormButtons from "@/shared/components/dialog/form-btn";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { createStaffInvitation } from "../staff-actions";
import { useDialog } from "@/shared/hooks/useDialog";

const InviteStaffForm = () => {
    const { handleAction, loading } = useActionHandler()
    const { closeDialog } = useDialog()
    const form = useForm({
        resolver: zodResolver(inviteStaffSchema),
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            role: "trainer",
            personalMessage: "",
        },
    });
    const onSubmit = form.handleSubmit(async (data) => {
        await handleAction(
            createStaffInvitation,
            data,
            {
                onSuccess(data) {
                    form.reset()
                    closeDialog()
                },
            }

        )
    });
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                    icon={<UserCircle />}
                />
                <FormInput
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                    icon={<UserCircle />}
                />
            </div>
            <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter email"
                icon={<Mail />}
            />
            <div>
                <FormInput
                    control={form.control}
                    type="select"
                    name="role"
                    label="Role"
                    placeholder="Select role"
                    options={[
                        {
                            label:
                                Role.admin.split("")[0].toUpperCase() +
                                Role.admin.substring(1),
                            value: Role.admin,
                        },
                        {
                            label:
                                Role.trainer.split("")[0].toUpperCase() +
                                Role.trainer.substring(1),
                            value: Role.trainer,
                        },
                    ]}
                />
                <span className="text-sm text-gray-500 ">
                    Admin have full access. Trainer have access to manage
                    members and classes.
                </span>
            </div>
            <FormInput
                control={form.control}
                name="personalMessage"
                label="Message (optional)"
                placeholder="Add a personal note to your invitation email"
                type="textarea"
            />
            <FormButtons
                actionBtnIcon={<SendHorizonal />}
                actionBtnTitle="Send Invitation"
                isLoading={loading}
                loadingText="Inviting..."
            />
        </form>
    );
};

export default InviteStaffForm;

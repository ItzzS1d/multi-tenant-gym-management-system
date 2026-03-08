"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { useDialog } from "@/shared/hooks/useDialog";
import FormButtons from "@/shared/components/dialog/form-btn";
import FormInput from "@/shared/components/ui/form-input";
import { Save } from "lucide-react";
import useSWR from "swr";
import { assignTrainerAction } from "../../new/member-actions";
import { Spinner } from "@/shared/components/ui/spinner";
import { getTrainersList } from "@/features/staff/staff-queries";
import { assignedTrainerSchema } from "../../member-validations";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AssignTrainerFormProps {
    memberId: string;
    currentTrainerId: string | null;
}

const AssignTrainerForm = ({
    memberId,
    currentTrainerId,
}: AssignTrainerFormProps) => {
    const { handleAction, loading: isSaving } = useActionHandler();
    const { closeDialog } = useDialog();

    const { data: trainers, isLoading } = useSWR<
        Awaited<ReturnType<typeof getTrainersList>>
    >("/api/trainers", fetcher);

    const form = useForm({
        resolver: zodResolver(assignedTrainerSchema),
        defaultValues: {
            assignedTrainerId: currentTrainerId || "",
        },
    });

    const onSubmit = form.handleSubmit(async (data) => {
        console.info(data);

        if (data.assignedTrainerId === "null") {
            return form.trigger("assignedTrainerId", { shouldFocus: true });
        }
        await handleAction(
            assignTrainerAction,
            {
                memberId,
                trainerId: data.assignedTrainerId,
            },
            {
                onSuccess: () => closeDialog(),
            },
        );
    });
    const trainersList =
        trainers && trainers.length > 0
            ? trainers.map((t) => ({
                label: t.user.name,
                value: t.id,
            }))
            : [{ label: "No Trainer Assigned", value: "null" }];

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Spinner className="h-8 w-8 text-primary" />
                <p className="text-sm text-gray-500 font-medium">
                    Loading trainers list...
                </p>
            </div>
        );
    }
    console.info(trainers);

    return (
        <form onSubmit={onSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-6 px-4">
                <FormInput
                    control={form.control}
                    name="assignedTrainerId"
                    label="Select Trainer"
                    type="select"
                    options={[
                        { label: "Select Trainer", value: "null" },
                        ...trainersList,
                    ]}
                />
            </div>

            <FormButtons
                actionBtnIcon={<Save size={18} />}
                actionBtnTitle={
                    currentTrainerId ? "Change Trainer" : "Assign Trainer"
                }
                isLoading={isSaving}
                loadingText="Updating..."
            />
        </form>
    );
};

export default AssignTrainerForm;

"use client";
import { planBaseSchema } from "@/features/plans/plans-validations";
import { Button } from "@/shared/components/ui/button";
import FormInput from "@/shared/components/ui/form-input";
import { Spinner } from "@/shared/components/ui/spinner";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { zodResolver } from "@hookform/resolvers/zod";
import { IdCard, IndianRupee, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { createPlan, updatePlan } from "../plans-actions";
import { useDialog } from "@/shared/hooks/useDialog";
import { PlanUpdateInput } from "../../../../prisma/generated/prisma/models";

type PlanFormProps =
    | {
          mode: "CREATE";
      }
    | {
          mode: "EDIT";
          defaultValues: PlanUpdateInput;
      };
const NewPlanForm = (props: PlanFormProps) => {
    const { mode } = props;
    const { handleAction, loading } = useActionHandler();
    const { closeDialog } = useDialog();
    const form = useForm({
        resolver: zodResolver(planBaseSchema),
        defaultValues:
            mode === "EDIT"
                ? props.defaultValues
                : {
                      description: "",
                      durationInDays: 1,
                      price: 0,
                      isActive: true,
                      name: "",
                  },
    });
    const onSubmit = form.handleSubmit(async (data) => {
        if (mode === "CREATE") {
            await handleAction(createPlan, data, {
                onSuccess: () => {
                    form.reset();
                    closeDialog();
                },
            });
        } else {
            await handleAction(
                updatePlan,
                { ...data, id: props.defaultValues.id },
                {
                    onSuccess: () => {
                        form.reset();
                        closeDialog();
                    },
                },
            );
        }
    });
    return (
        <div className="w-full  ">
            <form onSubmit={onSubmit} className="space-y-5">
                <FormInput
                    name="name"
                    control={form.control}
                    label="Plan Name"
                    placeholder="e.g., Gold Monthly Access"
                    icon={<IdCard />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        name="durationInDays"
                        type="number"
                        control={form.control}
                        label="Duration (Months)"
                        placeholder="1"
                    />
                    <FormInput
                        name="price"
                        type="number"
                        control={form.control}
                        label="Price"
                        placeholder="0.00"
                        icon={<IndianRupee />}
                    />
                </div>

                <FormInput
                    name="description"
                    type="textarea"
                    control={form.control}
                    label="Description"
                    placeholder="List the perks included in this plan..."
                    rows={5}
                />

                <div className="border-t border-border-light dark:border-border-dark my-4"></div>

                <FormInput
                    type="switch"
                    name="isActive"
                    control={form.control}
                    description="Enable to make this plan selectable when creating a member."
                    title="Plan Status"
                    checked
                />
                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={loading}
                        onClick={() => {
                            form.reset();
                            closeDialog();
                        }}
                        className="px-5 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className=" px-6 py-2.5 text-accent"
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save />
                                Save Plan
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewPlanForm;

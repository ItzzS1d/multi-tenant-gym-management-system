"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/shared/components/ui/form-input";
import FormButtons from "@/shared/components/dialog/form-btn";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { useDialog } from "@/shared/hooks/useDialog";
import { renewMembershipAction } from "../../new/member-actions";
import { renewMemberSchema } from "../../member-validations";
import { PAYMENT_METHOD } from "../../../../../prisma/generated/prisma/enums";
import { RefreshCw } from "lucide-react";
import useSWR from "swr";
import { Spinner } from "@/shared/components/ui/spinner";
import { getActivePlans } from "@/features/plans/queries";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface MembershipRenewalFormProps {
    memberId: string;
}

const MembershipRenewalForm = ({ memberId }: MembershipRenewalFormProps) => {
    const { handleAction, loading } = useActionHandler();
    const { closeDialog } = useDialog();

    const { data: plans, isLoading } = useSWR<
        Awaited<ReturnType<typeof getActivePlans>>
    >("/api/plans", fetcher);

    const form = useForm({
        resolver: zodResolver(renewMemberSchema),
        defaultValues: {
            memberId: memberId,
            startDate: new Date(),
            paymentMethod: "CASH" as PAYMENT_METHOD,
            amountPaid: 0,
            paymentNotes: "",
            membershipPlanId: "",
        },
    });

    const planOptions = (plans || []).map((p) => ({
        label: `${p.name} - ₹${p.price}`,
        value: p.id,
    }));

    const paymentMethodOptions = Object.values(PAYMENT_METHOD).map((m) => ({
        label: m,
        value: m,
    }));

    const selectedPlanId = form.watch("membershipPlanId");

    const onSubmit = form.handleSubmit(async (data) => {
        await handleAction(renewMembershipAction, data, {
            onSuccess() {
                closeDialog();
            },
        });
    });

    useEffect(() => {
        if (!plans) return;
        const plan = plans.find((p) => p.id === selectedPlanId);
        if (plan) {
            form.setValue("amountPaid", plan.price);
        }
    }, [selectedPlanId, plans, form]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Spinner className="h-8 w-8 text-primary" />
                <p className="text-sm text-gray-500 font-medium">
                    Loading active plans...
                </p>
            </div>
        );
    }
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
                type="select"
                name="membershipPlanId"
                control={form.control}
                label="Membership Plan"
                placeholder="Select a plan"
                options={planOptions}
            />

            <FormInput
                type="date"
                name="startDate"
                control={form.control}
                label="Start Date"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="select"
                    name="paymentMethod"
                    control={form.control}
                    label="Payment Method"
                    options={paymentMethodOptions}
                />
                <FormInput
                    type="number"
                    name="amountPaid"
                    control={form.control}
                    label="Amount Paid"
                />
            </div>

            <FormInput
                type="textarea"
                name="paymentNotes"
                control={form.control}
                label="Notes (Optional)"
                placeholder="Transaction ID, etc."
            />

            <FormButtons
                actionBtnIcon={<RefreshCw size={18} />}
                actionBtnTitle="Confirm Renewal"
                isLoading={loading}
                loadingText="Renewing..."
            />
        </form>
    );
};

export default MembershipRenewalForm;

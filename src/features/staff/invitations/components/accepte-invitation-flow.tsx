"use client";
import React, { useState } from "react";
import Step1 from "./step-1";
import { getInvitationDetails, Invitation } from "../queries";
import Step2 from "./step-2";
import Step3 from "./step-3";
import { Button } from "@/shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invitationSchema } from "../invitation-schema";
import { ArrowRight } from "lucide-react";

const steps = [
    {
        title: "Accept Invitation",
    },
    {
        title: "Verify Email",
    },
    {
        title: "Complete Profile",
    },
];
type AccepteInvitationFlowProps = {
    invitationDetails: Invitation;
    invitationId: string;
};
export default function AccepteInvitationFlow({
    invitationDetails,
    invitationId,
}: AccepteInvitationFlowProps) {
    const [step, setStep] = useState(2);
    const form = useForm({
        resolver: zodResolver(invitationSchema),
        defaultValues: {
            confirmPassword: "",
            email: invitationDetails.email,
            password: "",
            firstName: invitationDetails.firstName,
            lastName: invitationDetails.lastName,
        },
    });
    return (
        <form className="flex flex-col items-center justify-center  ">
            <div className="flex  items-center justify-center gap-5">
                {steps.map((step, i) => (
                    <div key={i}>
                        <div className="bg-primary  rounded-full  text-white">
                            {i + 1}.
                        </div>
                        <span>{step.title}</span>
                    </div>
                ))}
            </div>
            <div className="bg-surface-light p-8 sm:p-10 text-center dark:bg-surface-dark w-full max-w-lg shadow-xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50">
                {step === 1 && (
                    <Step1
                        invitationDetails={invitationDetails}
                        setStep={setStep}
                        step={step}
                    />
                )}
                {step === 2 && <Step2 control={form.control} />}
                {step === 3 && <Step3 />}

                {step !== 1 && (
                    <Button
                        onClick={() => setStep(step + 1)}
                        className="max-w-96 shrink-0 text-accent mt-5"
                    >
                        Next: Secure My Account <ArrowRight />
                    </Button>
                )}
            </div>
        </form>
    );
}

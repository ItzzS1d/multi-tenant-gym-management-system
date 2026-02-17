import { Button } from "@/shared/components/ui/button";
import { Lock } from "lucide-react";
import React from "react";
import { Invitation } from "../queries";
import Image from "next/image";

export default function Step1({
    invitationDetails,
    setStep,
    step,
}: {
    invitationDetails: Invitation;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
    return (
        <main>
            <div className="grow flex items-center justify-center px-4 py-8 sm:px-6">
                {/* Main */}
                <div>
                    {/* Content */}
                    <div>
                        <div className="mb-6 inline-flex flex-col items-center">
                            {invitationDetails?.organization?.logo ? (
                                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 border-2 border-white dark:border-slate-700 shadow-sm">
                                    <Image
                                        alt={
                                            invitationDetails.organization.name
                                        }
                                        className="h-12 w-12 rounded-full object-cover"
                                        src={
                                            invitationDetails.organization.logo
                                        }
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-3 border-2  shadow-sm">
                                    {invitationDetails?.organization?.name
                                        ?.split(" ")
                                        .map((word, index) => (
                                            <span
                                                key={index}
                                                className="text-2xl text-accent"
                                            >
                                                {word[0].toUpperCase()}
                                            </span>
                                        ))}
                                </div>
                            )}
                        </div>
                        <p className="text-2xl font-medium ">
                            {invitationDetails?.organization?.name}
                        </p>

                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            You&apos;ve been invited to join the team
                        </h1>

                        <p className="text-gray-600  text-lg mb-8">
                            Join as a{" "}
                            <span className="font-medium text-primary px-2 py-0.5 rounded">
                                {invitationDetails?.role
                                    .split("")[0]
                                    .toUpperCase() +
                                    invitationDetails?.role.substring(1)}
                            </span>
                        </p>

                        <div className="text-slate-500 dark:text-slate-400 text-sm mb-10 max-w-sm mx-auto">
                            {invitationDetails.personalMessage
                                ? invitationDetails.personalMessage
                                : "We're excited to have you on board. Accept the invitation to set up your staff profile and access the gym management dashboard."}
                        </div>

                        <Button
                            className="w-full  py-3.5 px-6 rounded-lg text-accent"
                            onClick={() => setStep(step + 1)}
                        >
                            Accept Invitation
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50  py-4 px-8 border-t border-slate-100  flex justify-center">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Lock className="text-gray-400" />
                            <span>
                                This link is sensitive and expires in 48 hours.
                                Please do not share it.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

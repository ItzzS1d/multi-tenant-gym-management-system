import FormInput from "@/shared/components/ui/form-input";
import React from "react";
import { Control } from "react-hook-form";
import { InvitationSchema } from "../invitation-schema";
import { Lock } from "lucide-react";

interface Step2Props {
    control: Control<InvitationSchema>;
}
const Step2 = ({ control }: Step2Props) => {
    return (
        <>
            <div>
                <div className=" text-left space-y-4">
                    <div>
                        <h1 className="text-2xl font-medium">
                            Verify your Identity
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Ensure your details are correct
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            control={control}
                            name="firstName"
                            label="First Name"
                        />
                        <FormInput
                            control={control}
                            name="lastName"
                            label="Last Name"
                        />
                    </div>

                    <div>
                        <FormInput
                            disabled
                            name="email"
                            control={control}
                            label="Email Address"
                        />
                        <p className="text-gray-500 text-sm  mt-1">
                            This email linked to your Invitation and cannot be
                            changed.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step2;

"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import FormInput from "@/shared/components/ui/form-input";
import { Dumbbell, User, Mail, PhoneCall, ArrowRight } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validations/client-validation";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { registerAction } from "../auth-actions";
import { Spinner } from "@/shared/components/ui/spinner";

const RegisterForm = () => {
    const { control, reset, handleSubmit } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
        },
    });
    const { handleAction, loading } = useActionHandler();

    const onSubmit = handleSubmit(async (data) => {
        await handleAction(registerAction, data, {
            onSuccess: () => {
                reset();
            },
        });
    });

    return (
        <div className="w-full max-w-110 flex flex-col   space-y-2 px-2 md:px-0">
            {/* Header */}
            <div className="text-center mb-3">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10  bg-primary rounded-full"
                >
                    <Dumbbell className="w-10 h-10 text-brand-primary -rotate-45 hover:rotate-180 transition-transform duration-500 text-accent" />
                </Link>
                <h2 className="text-3xl  tracking-tight mb-1">
                    Create Account
                </h2>
                <p className="text-gray-500 text-sm ">
                    Enter your details to register your gym.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="First Name"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        icon={<User size={18} />}
                        control={control}
                        disabled={loading}
                    />
                    <FormInput
                        control={control}
                        label="Last Name"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        icon={<User size={18} />}
                        disabled={loading}
                    />
                </div>

                <FormInput
                    label="Email"
                    name="email"
                    type="text"
                    placeholder="owner@gymmart.com"
                    icon={<Mail size={18} />}
                    control={control}
                    disabled={loading}
                />

                <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    placeholder="+91"
                    icon={<PhoneCall size={18} />}
                    control={control}
                    disabled={loading}
                />
                <FormInput
                    disabled={loading}
                    type="password"
                    placeholder="*********"
                    icon={<PhoneCall size={18} />}
                    control={control}
                    label="Password"
                    name="password"
                />

                <Button
                    type="submit"
                    className="group text-accent-foreground w-full flex items-center justify-center gap-2 py-4 px-6     transition-all duration-200 transform active:scale-[0.98]  shadow-brand-primary/20"
                    disabled={loading}
                >
                    <span className="text-accent">Create Account</span>
                    {loading ? (
                        <Spinner className="text-accent" />
                    ) : (
                        <ArrowRight
                            size={20}
                            className="group-hover:translate-x-2 transition-transform  text-accent"
                        />
                    )}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400 ">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-6">
                <p className="text-sm  text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="  hover:text-brand-primary transition-colors hover:underline font-semibold text-primary"
                    >
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;

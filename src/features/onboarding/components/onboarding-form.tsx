"use client";
import FormInput from "@/shared/components/ui/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { OnboardingSchema, onboardingSchema } from "../validations";
import { Dumbbell, Clock, CheckCircle } from "lucide-react";
import { TIME_OPTIONS } from "@/shared/constants/time";
import { Button } from "@/shared/components/ui/button";
import { HeroSection } from "@/features/auth/components/hero-section";
import { useEffect } from "react";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { completeOnboardingAction } from "../onboarding-actions";
import { Spinner } from "@/shared/components/ui/spinner";

const OnboardingForm = () => {
    const form = useForm<OnboardingSchema>({
        resolver: zodResolver(onboardingSchema),
        mode: "onSubmit",
        defaultValues: {
            gymName: "",
            subDomain: "",
            gymAddress: "",
            openingTime: "06:00 AM",
            closingTime: "12:00 AM",
        },
    });
    const { handleAction, loading } = useActionHandler();

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "gymName" && value.gymName) {
                const subdomain = value.gymName
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "");
                form.setValue("subDomain", subdomain);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const onSubmit = form.handleSubmit(async (data) => {
        await handleAction(completeOnboardingAction, data, {
            onSuccess() {
                form.reset();
            },
        });
    });

    return (
        <main className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
            <HeroSection
                title="The future of gym management starts here."
                description="Transform the way you run your fitness business with our all-in-one platform. Streamline operations, engage members, and unlock your gym's full potential."
                img="/onboading-form-image.png"
            />
            <section className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
                <form
                    onSubmit={onSubmit}
                    className="w-full max-w-[440px] space-y-6"
                >
                    {/* General Information Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Dumbbell className="text-primary" size={24} />
                            <h3 className="text-lg font-bold uppercase tracking-wider">
                                General Information
                            </h3>
                        </div>

                        <FormInput
                            control={form.control}
                            label="Gym Name"
                            name="gymName"
                            type="text"
                            placeholder="e.g. Iron Paradise Fitness"
                            disabled={loading}
                        />

                        <div className="flex flex-col gap-2">
                            <div className="flex group">
                                <FormInput
                                    control={form.control}
                                    label="Public URL"
                                    name="subDomain"
                                    type="text"
                                    placeholder="URL"
                                />
                                <span className="inline-flex items-center  rounded-r-lg border border-l-0 bg-slate-50 text-sm font-medium">
                                    .
                                    {process.env.NEXT_PUBLIC_BETTER_AUTH_DOMAIN}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium ">
                                Your site will be accessible at{" "}
                                {form.watch("subDomain")}.
                                {process.env.NEXT_PUBLIC_BETTER_AUTH_DOMAIN}
                            </p>
                        </div>

                        <FormInput
                            control={form.control}
                            label="Physical Address"
                            name="gymAddress"
                            type="textarea"
                            placeholder="Address"
                            disabled={loading}
                        />
                    </section>

                    <hr />

                    {/* Operating Hours Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="text-primary" size={24} />
                            <h3 className="text-lg font-semibold uppercase tracking-wider">
                                Operating Hours
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                control={form.control}
                                label="Opening Time"
                                name="openingTime"
                                type="select"
                                placeholder="Select opening time"
                                options={TIME_OPTIONS.map((time) => ({
                                    label: time,
                                    value: time,
                                }))}
                                disabled={loading}
                            />

                            <FormInput
                                control={form.control}
                                label="Closing Time"
                                name="closingTime"
                                type="select"
                                placeholder="Select closing time"
                                options={TIME_OPTIONS.map((time) => ({
                                    label: time,
                                    value: time,
                                }))}
                                disabled={loading}
                            />
                        </div>
                    </section>

                    {/* Footer Buttons */}
                    <div className="pt-6 border-t flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 h-12 text-md font-medium"
                            disabled={loading}
                        >
                            <span className="text-white">Complete Setup</span>
                            {loading ? (
                                <Spinner />
                            ) : (
                                <CheckCircle color="white" />
                            )}
                        </Button>
                    </div>
                </form>

                <footer className="mt-8 text-center text-sm text-muted-foreground">
                    &copy; 2024 Gym Mart Inc. All rights reserved.
                </footer>
            </section>
        </main>
    );
};

export default OnboardingForm;

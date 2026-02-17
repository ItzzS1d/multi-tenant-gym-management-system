"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { createMemberSchema, MAX_FILE_SIZE } from "../../member-validations";
import FormInput from "@/shared/components/ui/form-input";
import { Button } from "@/shared/components/ui/button";
import {
    Banknote,
    CircleUserRound,
    Contact,
    Dumbbell,
    ImagePlus,
    Mail,
    Phone,
    Save,
    UserCircle,
} from "lucide-react";
import {
    CONTACT_RELATION,
    GENDER,
    PAYMENT_METHOD,
} from "../../../../../prisma/generated/prisma/enums";
import { getPlansList, getTrainersList } from "../../new/queries";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Spinner } from "@/shared/components/ui/spinner";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { createNewMemberAction } from "../../new/member-actions";
import { cn } from "@/shared/lib/utils";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/shared/components/ui/avatar";

interface NewMemberFormProps {
    plansListPromise: ReturnType<typeof getPlansList>;
    trainersListPromise: ReturnType<typeof getTrainersList>;
}
const NewMemberForm = ({
    plansListPromise,
    trainersListPromise,
}: NewMemberFormProps) => {
    const router = useRouter();
    const [preview, setPreview] = useState<File | null>(null);
    const plansList = use(plansListPromise);
    const trainersList = use(trainersListPromise);
    const { handleAction, loading } = useActionHandler();

    const form = useForm({
        resolver: zodResolver(createMemberSchema),
        shouldFocusError: true,
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            assignedTrainerId: null,
            address: "",
            startDate: new Date(),
            emergencyName: "",
            emergencyPhone: "",
            gender: "MALE",
            image: "",
            membershipPlanId: "",
            paymentMethod: "CASH",
            relationship: "FRIEND",
            dob: new Date(),
            amountPaid: 0,
            discount: 0,
            paymentReceivedDate: new Date(),
            paymentNotes: "",
        },
    });

    const onSubmit = form.handleSubmit(async (data) => {
        await handleAction(createNewMemberAction, data, {
            onSuccess: () => {
                form.reset();
                setPreview(null);
                scrollTo({ top: 0 });
            },
        });
    });

    const imageError = form.formState.errors.image;
    const amountPaid = useWatch({
        control: form.control,
        name: "membershipPlanId",
    });
    useEffect(() => {
        if (imageError) {
            toast.error("Please upload an image");
        }
    }, [imageError]);
    useEffect(() => {
        if (!amountPaid) return;
        const selectedPlan = plansList.find((plan) => plan.id === amountPaid);
        form.setValue("amountPaid", selectedPlan?.price || 0);
    }, [amountPaid]);
    const plans =
        plansList && plansList.length > 0
            ? plansList.map((plan) => ({
                label: `${plan.name} (${plan.price})/${plan.durationInDays} Months`,
                value: plan.id,
            }))
            : [
                {
                    label: "No Plans Found",
                    value: "null",
                    disabled: true,
                },
            ];
    const assignedTrainers =
        trainersList && trainersList.length > 0
            ? trainersList.map((trainer) => ({
                label: `${(
                    <div className="flex items-center gap-1">
                        <Avatar>
                            <AvatarImage
                                src={trainer.memberDetails?.image}
                                alt={trainer.memberDetails?.firstName}
                            />
                            <AvatarFallback className={"uppercase"}>
                                {`${trainer.memberDetails?.firstName[0]} ${trainer.memberDetails?.lastName[0]}`}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}${trainer.memberDetails?.firstName} ${trainer.memberDetails?.lastName}     `,
                value: trainer.id,
            }))
            : [
                {
                    label: "No Trainers Found",
                    value: "null",
                    disabled: true,
                },
            ];
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setPreview(file);
        form.setValue("image", file);
    };

    return (
        <>
            <form
                onSubmit={onSubmit}
                className="w-full max-w-[960px] flex flex-col gap-6 mx-auto min-h-screen pb-15"
            >
                <div className="pb-4">
                    {/* Personal Information */}
                    <div className="p-6 md:p-8 border-b border-[#e7f3eb] dark:border-[#2d4a35]">
                        <h3 className="text-[#0d1b12] dark:text-white text-lg font-bold leading-tight mb-6 flex items-center gap-2">
                            <CircleUserRound className="text-primary" />
                            Personal Information
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center gap-3 min-w-[140px]">
                                <div
                                    className={cn(
                                        "relative group cursor-pointer w-32 h-32 rounded-full bg-[#f8fcf9] dark:bg-[#102216]  border-dashed  dark:border-[#2d4a35] flex items-center justify-center hover:border-primary transition-colors duration-200",
                                        !preview && "border-2",
                                        form.formState.errors.image
                                            ? "border-red-500"
                                            : "border-[#cfe7d7]",
                                    )}
                                >
                                    <div className="flex flex-col items-center text-[#4c9a66]">
                                        {preview ? (
                                            <>
                                                <Image
                                                    src={
                                                        URL.createObjectURL(
                                                            preview,
                                                        ) || ""
                                                    }
                                                    alt="Preview"
                                                    fill
                                                    className="w-full  h-full object-cover rounded-full"
                                                />
                                            </>
                                        ) : (
                                            <div
                                                className={cn(
                                                    "flex flex-col items-center",
                                                    form.formState.errors.image
                                                        ? "text-red-500"
                                                        : "",
                                                )}
                                            >
                                                <ImagePlus
                                                    className="text-3xl"
                                                    aria-hidden
                                                />
                                                <span className="text-xs mt-1 font-medium">
                                                    Upload
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 text-center">
                                    Profile Photo (Max{" "}
                                    {MAX_FILE_SIZE / 1024 / 1024}
                                    MB)
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                                <FormInput
                                    control={form.control}
                                    name="firstName"
                                    label="First Name"
                                    placeholder="e.g. John"
                                    icon={<UserCircle />}
                                />
                                <FormInput
                                    control={form.control}
                                    name="lastName"
                                    label="Last Name"
                                    placeholder="e.g. Doe"
                                    icon={<UserCircle />}
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
                                        {
                                            label: GENDER.MALE,
                                            value: GENDER.MALE,
                                        },
                                        {
                                            label: GENDER.FEMALE,
                                            value: GENDER.FEMALE,
                                        },
                                        {
                                            label: GENDER.OTHER,
                                            value: GENDER.OTHER,
                                        },
                                    ]}
                                />
                                <FormInput
                                    control={form.control}
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    icon={<Mail />}
                                />
                                <FormInput
                                    control={form.control}
                                    name="phone"
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="+91"
                                    icon={<Phone />}
                                />
                                <div className="md:col-span-2">
                                    <FormInput
                                        control={form.control}
                                        name="address"
                                        label="Address"
                                        type="textarea"
                                        placeholder="Full residential address..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="p-6 md:p-8 border-b border-[#e7f3eb] dark:border-[#2d4a35]">
                        <h3 className="text-[#0d1b12] dark:text-white text-lg font-bold leading-tight mb-6 flex items-center gap-2">
                            <Contact className="text-primary" />
                            Emergency Contact
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <FormInput
                                control={form.control}
                                name="emergencyName"
                                label="Emergency Contact Name"
                                placeholder="e.g. Jane Doe"
                                icon={<UserCircle />}
                            />
                            <FormInput
                                control={form.control}
                                name="emergencyPhone"
                                label="Emergency Contact Phone"
                                type="tel"
                                placeholder="+91"
                                icon={<Phone />}
                            />
                            <FormInput
                                control={form.control}
                                name="relationship"
                                label="Relationship"
                                type="select"
                                options={Object.values(CONTACT_RELATION).map(
                                    (value) => ({
                                        value,
                                        label:
                                            value.charAt(0) +
                                            value.slice(1).toLowerCase(),
                                    }),
                                )}
                            />
                        </div>
                    </div>

                    {/* Membership Details */}
                    <div className="p-6 md:p-8 border-b border-[#e7f3eb] dark:border-[#2d4a35]">
                        <h3 className="text-[#0d1b12] dark:text-white text-lg font-bold leading-tight mb-6 flex items-center gap-2">
                            <Dumbbell className="text-primary" />
                            Membership Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <FormInput
                                control={form.control}
                                name="membershipPlanId"
                                label="Membership Plan"
                                type="select"
                                options={plans}
                                placeholder="Select Plan"
                            />

                            <FormInput
                                control={form.control}
                                name="startDate"
                                label="Start Date"
                                type="date"
                            />
                            <FormInput
                                control={form.control}
                                name="assignedTrainerId"
                                label="Assigned Trainer"
                                type="select"
                                options={assignedTrainers}
                            />
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="p-6 md:py-4 ">
                        <h3 className="text-[#0d1b12] dark:text-white text-lg font-semibold leading-tight mb-6 flex items-center gap-2">
                            <Banknote className="text-primary" />
                            Payment Information
                        </h3>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <FormInput
                                    control={form.control}
                                    name="paymentMethod"
                                    label="Payment Method"
                                    type="select"
                                    options={[
                                        {
                                            label: PAYMENT_METHOD.UPI,
                                            value: PAYMENT_METHOD.UPI,
                                        },
                                        {
                                            label: PAYMENT_METHOD.CASH,
                                            value: PAYMENT_METHOD.CASH,
                                        },
                                    ]}
                                />

                                <FormInput
                                    control={form.control}
                                    name="paymentReceivedDate"
                                    label="Payment Received Date"
                                    type="date"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                                <FormInput
                                    control={form.control}
                                    name="amountPaid"
                                    label="Amount Paid"
                                    type="number"
                                />
                                <FormInput
                                    control={form.control}
                                    name="discount"
                                    label="Discount"
                                    type="number"
                                />
                            </div>
                            <div>
                                <FormInput
                                    control={form.control}
                                    name="paymentNotes"
                                    label="Payment Notes"
                                    type="textarea"
                                    rows={9}
                                    placeholder="Enter payment notes example: paid via gpay or phonepe"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                        <div className="mx-auto max-w-5xl flex justify-end gap-3 p-2">
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                                className="w-28"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant={loading ? "secondary" : "default"}
                                className={cn("w-36", !loading && "text-accent")}
                            >
                                {loading ? (
                                    <>
                                        <Spinner className="mr-2" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Member
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
            {loading && (
                <div className="fixed   inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-md rounded-xl transition-all animate-in fade-in duration-300">
                    <div className="relative">
                        <div className="w-26 h-26 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Dumbbell className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                    </div>
                    <p className="mt-4 text-2xl font-medium  text-primary animate-bounce">
                        Creating {form.getValues("firstName")}&apos;s Profile
                    </p>
                </div>
            )}
        </>
    );
};

export default NewMemberForm;

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "../validations/client-validation";
import { ArrowRight, Dumbbell, Mail, PhoneCall } from "lucide-react";
import FormInput from "@/shared/components/ui/form-input";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { loginAction, tenantLoginAction } from "../auth-actions";
import { Spinner } from "@/shared/components/ui/spinner";
import { useSearchParams } from "next/navigation";
import { Route } from "next";
import Image from "next/image";

interface Tenant {
    name: string;
    logo?: string;
}
type LoginFormProps =
    | {
          mode: "default";
      }
    | {
          mode: "tenant";
          tenant: Tenant;
      };
const LoginForm = (props: LoginFormProps) => {
    const { control, handleSubmit, reset } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const { handleAction, loading } = useActionHandler();
    const params = useSearchParams();

    const onSubmit = handleSubmit(async (data) => {
        const redirectTo = (
            params.get("redirectTo")?.startsWith("/")
                ? params.get("redirectTo")
                : props.mode === "tenant"
                  ? "/members"
                  : "/"
        ) as Route;
        await handleAction(
            props.mode === "tenant" ? tenantLoginAction : loginAction,
            {
                values: data,
                redirectTo,
            },
            {
                onSuccess: () => {
                    reset();
                },
            },
        );
    });
    return (
        <div className="w-full max-w-[440px] flex flex-col space-y-2 py-8 px-2 md:px-0">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20  rounded-[24px] mb-6 bg-background">
                    {props.mode === "tenant" && props.tenant.logo ? (
                        <Image
                            src={props.tenant.logo}
                            alt="Logo"
                            className="w-10 h-10"
                        />
                    ) : (
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10  bg-primary rounded-full"
                        >
                            <Dumbbell className="w-10 h-10 text-brand-primary -rotate-45 hover:rotate-180 transition-transform duration-500 text-accent" />
                        </Link>
                    )}
                </div>
                <h2 className="text-3xl  tracking-tight mb-2">Login</h2>
                <p className="text-gray-500 text-sm ">
                    {`Enter your details to login into ${props.mode === "tenant" ? props.tenant.name : "GymMart"}.`}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
                <FormInput
                    label="Email"
                    name="email"
                    type="text"
                    placeholder="example@email.com"
                    icon={<Mail size={18} />}
                    control={control}
                    disabled={loading}
                />

                <FormInput
                    type="password"
                    placeholder="*********"
                    icon={<PhoneCall size={18} />}
                    control={control}
                    label="Password"
                    name="password"
                    disabled={loading}
                />

                <Button
                    type="submit"
                    className="group text-accent w-full flex items-center justify-center gap-2 py-4 px-6     transition-all duration-200 transform active:scale-[0.98]  "
                    disabled={loading}
                >
                    <span>Login</span>

                    {loading ? (
                        <Spinner className="text-accent" />
                    ) : (
                        <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform text-accent"
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
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-primary font-medium hover:text-brand-primary transition-colors hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;

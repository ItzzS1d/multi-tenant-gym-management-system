import { HeroSection } from "@/features/auth/components/hero-section";
import LoginForm from "@/features/auth/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | GymMart",
    description: "Sign in to your GymMart account to manage your gym operations.",
    robots: {
        index: true,
        follow: true,
    },
};

const Login = () => {
    return (
        <main className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
            <HeroSection
                title="Welcome Back"
                description="Sign in to continue managing your gym"
            />
            <section className="w-full lg:w-1/2 h-svh  flex flex-col items-center justify-center  sm:p-12 ">
                <LoginForm mode="default" />
            </section>
        </main>
    );
};

export default Login;

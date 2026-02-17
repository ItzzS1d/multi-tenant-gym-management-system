import { HeroSection } from "@/features/auth/components/hero-section";
import RegisterForm from "@/features/auth/components/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Start Your Fitness Journey | GymMart",
    description:
        "Create your GymMart account and grow your fitness business with our all-in-one gym management platform.",
    robots: {
        index: true,
        follow: true,
    },
};

const Register = () => {
    return (
        <main className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
            <HeroSection
                title="Grow your fitness business with Gym Mart."
                description="The all-in-one management tool designed."
            />
            <section className="w-full lg:w-1/2 py-2 md:py-0 pb-4 md:pb-0 flex flex-col items-center justify-center  sm:p-12 h-svh">
                <RegisterForm />
            </section>
        </main>
    );
};

export default Register;

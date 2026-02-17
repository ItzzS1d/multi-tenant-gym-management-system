import { HeroSection } from "@/features/auth/components/hero-section";
import LoginForm from "@/features/auth/components/login-form";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
    const { subdomain } = await params;
    const gymName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

    return {
        title: `Login | ${gymName}`,
        description: `Sign in to ${gymName} member portal.`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

const Login = async ({
    params,
}: Readonly<PageProps<"/s/[subdomain]/login">>) => {
    const { subdomain } = await params;
    const gymName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

    return (
        <main className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
            <HeroSection
                title="Welcome Back"
                description="Sign in to continue managing your gym"
            />
            <section className="w-full lg:w-1/2 h-full  flex flex-col items-center justify-center  sm:p-12 ">
                {/*<LoginForm
                    mode="tenant"
                    tenant={{ logo: gym.logo, name: gym.name }}
                />*/}
                <LoginForm
                    mode="tenant"
                    tenant={{
                        name: gymName,
                    }}
                />
            </section>
        </main>
    );
};

export default Login;

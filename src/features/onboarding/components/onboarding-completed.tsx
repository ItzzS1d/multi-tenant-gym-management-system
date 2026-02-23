import { getActiveOrganization } from "@/shared/lib/tenant";
import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { AnimatedCheckIcon } from "./animated-check-icon";
import { constructUrl } from "@/shared/lib/server-utils";

const OnboardingCompleted = ({
    organization,
}: {
    organization: ReturnType<typeof getActiveOrganization>;
}) => {
    const activeOrg = use(organization);

    const url = constructUrl("/dashboard", activeOrg.gym.slug);
    return (
        <main className="flex-1 flex flex-col items-center justify-center  min-h-svh">
            <div className="w-full max-w-lg bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 sm:p-12 text-center transition-all">
                <AnimatedCheckIcon />
                <h1 className="text-3xl font-semibold text-text-main dark:text-white mb-4 tracking-tight">
                    Onboarding Already Completed
                </h1>
                <p className="text-text-muted dark:text-gray-400 text-lg leading-relaxed mb-10 max-w-sm mx-auto">
                    Your gym is already set up and ready to go. There is no need
                    to complete the onboarding process again.
                </p>
                <div className="flex flex-col gap-4 items-center w-full">
                    <Link
                        href={url}
                        className="w-full text-accent sm:w-auto min-w-[200px] h-12 bg-primary hover:bg-primary-dark hover:scale-[1.02] text-background-dark font-bold rounded-lg transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
                        replace
                    >
                        <span>Go to Dashboard</span>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[20px]">
                            <ArrowRight />
                        </span>
                    </Link>
                    <Link
                        className="text-sm font-medium text-text-muted hover:text-primary dark:text-gray-500 dark:hover:text-primary transition-colors flex items-center gap-1"
                        href="/"
                        replace
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            <Home />
                        </span>
                        Back to Home
                    </Link>
                </div>
            </div>
            <div
                aria-hidden="true"
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl -z-10 pointer-events-none opacity-40 dark:opacity-10"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl filter mix-blend-multiply dark:mix-blend-normal"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl filter mix-blend-multiply dark:mix-blend-normal"></div>
            </div>
        </main>
    );
};

export default OnboardingCompleted;

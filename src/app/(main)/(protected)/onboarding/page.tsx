import OnboardingCompleted from "@/features/onboarding/components/onboarding-completed";
import OnboardingForm from "@/features/onboarding/components/onboarding-form";
import InvalidLinkPage from "@/shared/components/token-expired";
import { setCookie } from "@/shared/lib/cookie-util";
import { requireUser } from "@/shared/lib/session";
import { getActiveOrganization } from "@/shared/lib/tenant";
import { redirect, RedirectType } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Setup Your Gym | GymMart",
    description:
        "Complete your gym setup to start managing memberships, staff, and operations.",
    robots: {
        index: false,
        follow: false,
    },
};

const Onboarding = async ({
    searchParams,
}: Readonly<PageProps<"/onboarding">>) => {
    const { error } = await searchParams;
    if (error) {
        return <InvalidLinkPage />;
    }
    const { user } = await requireUser();
    if (!user || !user.emailVerified) {
        await setCookie({
            message: "Session expired please login again",
            type: "error",
        });
        return redirect("/login", RedirectType.replace);
    }
    if (user.hasCompletedOnboarding) {
        const organization = getActiveOrganization(user.id);
        return <OnboardingCompleted organization={organization} />;
    }
    return <OnboardingForm />;
};

export default Onboarding;

import type { Metadata } from "next";
import "../../globals.css";
import { requireUser } from "@/shared/lib/session";
// import CompleteOnboarding from "@/features/onboarding/components/complete-onboarding-modal";

export const metadata: Metadata = {
    title: "GymMart | All-in-One Gym Management Software",
    description:
        "Modern gym management SaaS to handle memberships, attendance, staff, and expenses effortlessly.",
    robots: {
        index: true,
        follow: true,
    },
};

export default async function MainRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { user } = await requireUser();
    return (
        <>
            {/*{!user.hasCompletedOnboarding && <CompleteOnboarding />}*/}
            {children}
        </>
    );
}

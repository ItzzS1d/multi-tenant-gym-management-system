import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "GymMart | All-in-One Gym Management Software",
    description:
        "Modern gym management SaaS to handle memberships, attendance, staff, and expenses effortlessly.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}

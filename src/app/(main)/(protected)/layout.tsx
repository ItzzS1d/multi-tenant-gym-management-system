import type { Metadata } from "next";
import "../../globals.css";
import Header from "@/shared/main/components/header";
import { isAuthenticated } from "@/shared/lib/session";
import { redirect } from "next/navigation";
import { RedirectType } from "next/navigation";

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
    if (!(await isAuthenticated())) {
        return redirect("/login", RedirectType.replace);
    }
    return (
        <>
            <Header />
            {children}
        </>
    );
}

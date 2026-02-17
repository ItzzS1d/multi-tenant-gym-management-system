import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "sonner";
import DialogContextProvider from "@/shared/contexts/dialog-context";

export const metadata: Metadata = {
    title: "GymMart | All-in-One Gym Management Software",
    description:
        "Modern gym management SaaS to handle memberships, attendance, staff, and expenses effortlessly.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function SubdomainRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Toaster position="top-right" richColors />
            <DialogContextProvider>{children}</DialogContextProvider>
        </>
    );
}

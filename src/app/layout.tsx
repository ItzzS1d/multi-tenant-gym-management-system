import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { FlashToast } from "@/shared/lib/flash-toast";
import { getFlash } from "@/shared/lib/cookie-util";

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
    title: "GymMart | All-in-One Gym Management Software",
    description:
        "Modern gym management SaaS to handle memberships, attendance, staff, and expenses effortlessly.",
    robots: {
        index: true,
        follow: true,
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const flash = await getFlash();

    return (
        <html lang="en">
            <body
                className={`${roboto.variable} font-roboto  antialiased h-svh `}
            >
                <NextTopLoader
                    color="#16eb5a"
                    showSpinner={false}
                    height={3.8}
                />
                <Toaster position="top-right" richColors />
                <FlashToast flash={flash} />
                {children}
            </body>
        </html>
    );
}

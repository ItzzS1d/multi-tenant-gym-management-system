import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { requireUser } from "@/shared/lib/session";
import { getSubdomainDetails } from "@/shared/lib/tenant";
import { AppSidebar } from "@/shared/subdomain/components/app-sidebar";
import SiteHeader from "@/shared/subdomain/components/SiteHeader";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CSSProperties } from "react";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
    const { subdomain } = await params;

    const gymName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

    return {
        title: {
            template: `%s | ${gymName}`,
            default: gymName,
        },
        description: `Manage your membership, attendance, and bookings at ${gymName}.`,
        robots: {
            index: true,
            follow: true,
        },
    };
}
export default async function SubdomainMainLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ subdomain: string }>;
}) {
    await requireUser();
    const { subdomain } = await params;
    const result = await getSubdomainDetails(subdomain);
    if (!result) {
        notFound();
    }
    const cookieStore = await cookies();
    const defaultValue = cookieStore.get("sidebar_state")?.value === "true";

    return (
        <>
            <SidebarProvider
                defaultOpen={defaultValue}
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 50)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as CSSProperties
                }
            >
                <AppSidebar />

                <SidebarInset>
                    <SiteHeader />

                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4  md:gap-6 px-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}

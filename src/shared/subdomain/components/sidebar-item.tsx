"use client";

import { SIDEBAR_LINKS } from "@/shared/constants/sidebarLinks";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { useTopLoader } from "nextjs-toploader";
import { cn } from "@/shared/lib/utils";
import { ROLE } from "../../../../prisma/generated/prisma/enums";
import {
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { Route } from "next";

const SidebarItems = ({ role }: { role: ROLE }) => {
    const pathname = usePathname();
    const router = useRouter();
    const loader = useTopLoader();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!e.altKey) return;
            const target = e.target as HTMLElement;
            if (["INPUT", "TEXTAREA"].includes(target?.tagName)) return;

            if (!/^[1-9]$/.test(e.key)) return;
            const index = Number(e.key) - 1;
            const item = SIDEBAR_LINKS[index];

            if (!item) return;

            e.preventDefault();

            router.push(item.href as Route);
            loader.start();
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (!e.altKey) return;
            const target = e.target as HTMLElement;
            if (["INPUT", "TEXTAREA"].includes(target?.tagName)) return;

            const item = SIDEBAR_LINKS.find((link) =>
                pathname.toLowerCase().startsWith(link.href.toLowerCase()),
            );

            if (!item) return;
            const navigateUp = () => {
                const currentIndex = SIDEBAR_LINKS.findIndex(
                    (link) =>
                        link.href.toLowerCase() === item.href.toLowerCase(),
                );
                if (currentIndex > 0) {
                    router.push(SIDEBAR_LINKS[currentIndex - 1].href as Route);
                    loader.start();
                }
            };
            const navigateDown = () => {
                const currentIndex = SIDEBAR_LINKS.findIndex(
                    (link) =>
                        link.href.toLowerCase() === item.href.toLowerCase(),
                );
                if (currentIndex < SIDEBAR_LINKS.length - 1) {
                    router.push(SIDEBAR_LINKS[currentIndex + 1].href as Route);
                    loader.start();
                }
            };

            e.preventDefault();
            if (e.key === "ArrowUp") {
                navigateUp();
            } else if (e.key === "ArrowDown") {
                navigateDown();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keydown", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keydown", handleKeyUp);
        };
    }, [router, loader, pathname]);

    const visibleLinks = SIDEBAR_LINKS.filter((link) =>
        link.allowedRoles.includes(role),
    );
    return (
        <>
            {visibleLinks.map((item, i) => {
                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                return (
                    <SidebarMenuItem key={i}>
                        <SidebarMenuButton tooltip={item.title}>
                            <Link
                                href={item.href as Route}
                                className={cn(
                                    "flex items-center gap-1 ",
                                    isActive && "text-white bg-primary",
                                )}
                            >
                                <item.icon aria-hidden />
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </>
    );
};

export default SidebarItems;

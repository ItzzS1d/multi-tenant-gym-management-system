"use client";

import { SIDEBAR_LINKS } from "@/shared/constants/sidebarLinks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTopLoader } from "nextjs-toploader";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import { Route } from "next";
import { Role } from "../../../../prisma/generated/prisma/enums";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const SidebarItems = ({ role }: { role: Role }) => {
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
                const isParentActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                if (item.subMenus?.length) {
                    return (
                        <Collapsible key={i} defaultOpen={isParentActive}>
                            <SidebarMenuItem>
                                <CollapsibleTrigger
                                    render={
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            className="justify-between"
                                        >
                                            <div className="flex items-center gap-2 ">
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </div>

                                            <ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
                                        </SidebarMenuButton>
                                    }
                                />

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.subMenus.map((sub, j) => {
                                            const isChildActive =
                                                pathname === sub.href ||
                                                pathname.startsWith(
                                                    `${sub.href}/`,
                                                );

                                            return (
                                                <SidebarMenuSubItem key={j}>
                                                    <SidebarMenuSubButton
                                                        isActive={isChildActive}
                                                        onClick={() => {
                                                            loader.start();
                                                            router.push(
                                                                sub.href as Route,
                                                            );
                                                        }}
                                                        className="cursor-pointer "
                                                    >
                                                        <sub.icon />
                                                        <span>{sub.title}</span>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                }

                return (
                    <SidebarMenuItem key={i}>
                        <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isActive}
                            onClick={() => {
                                loader.start();
                                router.push(item.href as Route);
                            }}
                        >
                            <item.icon aria-hidden />
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </>
    );
};

export default SidebarItems;

import {
    Briefcase,
    CalendarCheck,
    CreditCard,
    Users,
    Wallet,
    Settings,
    LucideIcon,
    Mails,
    Users2,
    WatchIcon,
} from "lucide-react";
import { Role } from "../../../prisma/generated/prisma/enums";
import { Watch } from "react-hook-form";

export interface SidebarLink {
    title: string;
    href: string;
    icon: LucideIcon;
    allowedRoles: Role[];
    subMenus?: {
        title: string;
        href: string;
        icon: LucideIcon;
        allowedRoles: Role[];
    }[];
}

export const SIDEBAR_LINKS: SidebarLink[] = [
    {
        title: "Members",
        href: "/members",
        icon: Users,
        allowedRoles: [Role.owner, Role.god, Role.trainer, Role.admin],
    },
    {
        title: "Staff Management",
        subMenus: [
            {
                title: "Staff",
                href: "/staff",
                icon: Users2,
                allowedRoles: [Role.owner, Role.god, Role.admin],
            },
            {
                title: "Invitations",
                href: "/invitations",
                icon: Mails,
                allowedRoles: [Role.owner, Role.god, Role.admin],
            },
        ],
        href: "/staff",
        icon: Briefcase,
        allowedRoles: [Role.owner, Role.god, Role.admin],
    },
    {
        title: "Plans",
        href: "/plans",
        icon: CreditCard,
        allowedRoles: [Role.owner, Role.god, Role.admin, Role.trainer],
    },
    {
        title: "Attendance",
        href: "/attendance",
        icon: CalendarCheck,
        allowedRoles: [Role.owner, Role.god, Role.admin, Role.trainer],
        subMenus: [
            {
                title: "Check-In / Check-Out",
                allowedRoles: [Role.owner, Role.god, Role.admin, Role.trainer],
                href: "/attendance/check-in-out",
                icon: WatchIcon,
            },
            {
                title: "Attendance Records",
                allowedRoles: [Role.owner, Role.god, Role.admin, Role.trainer],
                href: "/attendance/records",
                icon: CalendarCheck,
            },
        ],
    },
    {
        title: "Expenses",
        href: "/expenses",
        icon: Wallet,
        allowedRoles: [Role.owner, Role.god, Role.admin],
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        allowedRoles: [Role.owner, Role.god, Role.admin, Role.trainer],
    },
];

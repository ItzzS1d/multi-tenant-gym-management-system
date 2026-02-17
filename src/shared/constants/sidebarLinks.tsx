import {
    Briefcase,
    CalendarCheck,
    CreditCard,
    Users,
    Wallet,
    Settings,
    LucideIcon,
} from "lucide-react";
import { Role } from "../../../prisma/generated/prisma/enums";

export interface SidebarLink {
    title: string;
    href: string;
    icon: LucideIcon;
    allowedRoles: Role[];
}

export const SIDEBAR_LINKS: SidebarLink[] = [
    {
        title: "Members",
        href: "/members",
        icon: Users,
        allowedRoles: [Role.owner, Role.god, Role.trainer, Role.admin],
    },
    {
        title: "Staff",
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
    },
    {
        title: "Expenses",
        href: "/expenses",
        icon: Wallet,
        allowedRoles: [Role.owner, Role.god, Role.admin, Role.trainer],
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        allowedRoles: [Role.owner, Role.god, Role.admin, Role.trainer],
    },
];

import { clsx, type ClassValue } from "clsx";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";
export const rootDomain = process.env.BETTER_AUTH_DOMAIN || "localhost:3000";

export const constructUrl = (pathName: string, subDomain: string) => {
    return `${protocol}://${subDomain}.${rootDomain}${pathName}`;
};

export function extractSubdomain(request: NextRequest): string | null {
    const url = request.url;

    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const localRoots = ["myapp.local"];

    // 1. Check for local custom domain (myapp.local)
    for (const localRoot of localRoots) {
        if (hostname.endsWith(`.${localRoot}`)) {
            return hostname.replace(`.${localRoot}`, "");
        }
    }

    // Local development environment
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
        // Try to extract subdomain from the full URL
        const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
        console.info(fullUrlMatch);

        if (fullUrlMatch && fullUrlMatch[1]) {
            return fullUrlMatch[1];
        }

        // Fallback to host header approach
        if (hostname.includes(".localhost")) {
            return hostname.split(".")[0];
        }

        return null;
    }

    // Production environment
    const rootDomainFormatted = rootDomain.split(":")[0];

    // Handle preview deployment URLs (tenant---branch-name.vercel.app)
    if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
        const parts = hostname.split("---");
        return parts.length > 0 ? parts[0] : null;
    }

    // Regular subdomain detection
    const isSubdomain =
        hostname !== rootDomainFormatted &&
        hostname !== `www.${rootDomainFormatted}` &&
        hostname.endsWith(`.${rootDomainFormatted}`);

    return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

export function formatDate(date: Date | string) {
    return format(date, "dd-MMM-yyyy");
}

export function formatTime(date: Date | string) {
    return format(date, "hh:mm a");
}

export function formatDuration(start: Date | string, end: Date | string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInMinutes = Math.round(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60),
    );

    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours === 0) {
        return `${minutes}m`;
    }

    if (minutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
}

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
};

// does this 12,50,00
export const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "decimal",
        maximumFractionDigits: 0,
    }).format(value);
};

// does this 12L
export const formatCompactNumberCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
        notation: "compact",
        compactDisplay: "short",
    }).format(value);
};

export function formatMonthYear(date: Date | string | number) {
    return format(date, "MMMM yyyy");
}

export function formatISODate(date: Date | string | number) {
    return format(date, "yyyy-MM-dd");
}

export function formatDateWithOrdinal(date: Date | string | number) {
    return format(date, "MMM do");
}

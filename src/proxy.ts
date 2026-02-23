import { NextRequest, NextResponse } from "next/server";
import { ipAddress } from "@vercel/functions";
import { auth } from "./shared/config/auth.config";
import { extractSubdomain } from "./shared/lib/utils";
import { Route } from "next";

const RESERVED = ["www", "app", "api"];

const PUBLIC_ROUTES = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/",
] as Route[];

const AUTH_PAGES = ["/login", "/register"] as Route[];

const ROOT_DOMIAN_PROTECTED = [
    "/onboarding",
    "/dashboard",
    "/accept-invitation",
] as Route[];

export default async function Proxy(req: NextRequest) {
    const { pathname, searchParams, origin } = req.nextUrl;

    const ip = ipAddress(req);
    const userAgent = req.headers.get("user-agent");
    req.headers.set("x-forwarded-for", ip || "unknown");
    req.headers.set("user-agent", userAgent || "unknown");

    const session = await auth.api.getSession(req);
    const isAuthenticated = !!session;

    const subdomain = extractSubdomain(req);

    /**
     * ───────────────────────────────
     * TENANT SUBDOMAIN
     * ───────────────────────────────
     */

    if (subdomain && !RESERVED.includes(subdomain.toLowerCase())) {
        const isPublicRoute = PUBLIC_ROUTES.some(
            (route) => pathname === route || pathname.startsWith(`${route}/`),
        );

        //  Logged-in user hitting login/register
        if (isAuthenticated && AUTH_PAGES.includes(pathname as Route)) {
            // 1️⃣ redirectTo param
            const redirectTo = searchParams.get("redirectTo");
            if (redirectTo?.startsWith("/")) {
                return NextResponse.redirect(new URL(redirectTo, origin));
            }

            //  safe same-origin referer
            const referer = req.headers.get("referer");
            if (referer && referer.startsWith(origin)) {
                return NextResponse.redirect(referer);
            }

            //  fallback → tenant root
            return NextResponse.redirect(new URL("/members", origin));
        }

        // 🔒 Protect private routes
        if (!isPublicRoute && pathname !== "/" && !isAuthenticated) {
            return NextResponse.redirect(
                new URL(
                    `/login?redirectTo=${encodeURIComponent(pathname)}`,
                    origin,
                ),
            );
        }

        //  Rewrite into tenant space (internal only)
        const url = req.nextUrl.clone();
        url.pathname =
            pathname === "/" ? `/s/${subdomain}` : `/s/${subdomain}${pathname}`;
        url.search = req.nextUrl.search;

        return NextResponse.rewrite(url);
    }

    /**
     * ───────────────────────────────
     * ROOT DOMAIN
     * ───────────────────────────────
     */

    if (ROOT_DOMIAN_PROTECTED.includes(pathname as Route) && !isAuthenticated) {
        return NextResponse.redirect(
            new URL(
                `/login?redirectTo=${encodeURIComponent(pathname)}`,
                origin,
            ),
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|.*\\.(?:jpg|jpeg|png|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)$).*)",
    ],
};

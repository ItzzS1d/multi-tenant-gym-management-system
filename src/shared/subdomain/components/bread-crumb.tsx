"use client";

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import React from "react";
import Link from "next/link";
import { Route } from "next";

export default function Titlebar() {
    const pathname = usePathname();
    const segments =
        pathname?.split("/").filter((segment) => segment !== "") || [];

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const href =
                        `/${segments.slice(0, index + 1).join("/")}` as Route;

                    const formattedSegment = segment
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase());

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>
                                        {formattedSegment}
                                    </BreadcrumbPage>
                                ) : (
                                    <Link href={href}>{formattedSegment}</Link>
                                )}
                            </BreadcrumbItem>

                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

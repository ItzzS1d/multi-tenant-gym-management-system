"use client";

import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const InvitationListRefreshButtons = () => {
    const router = useRouter();
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => router.refresh()}
                className="h-8 md:h-9"
            >
                Refresh List
            </Button>
            <span className="text-xs text-muted-foreground hidden sm:inline">
                or check your{" "}
                <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground underline-offset-2"
                >
                    inbox
                </a>
            </span>
        </div>
    );
};

export default InvitationListRefreshButtons;

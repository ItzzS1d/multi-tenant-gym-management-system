"use client";

import { useEffect } from "react";
import { toast, ToastTypes } from "sonner";

export type FlashToastProps = {
    type: ToastTypes;
    message: string;
};
export function FlashToast({ flash }: { flash: FlashToastProps | null }) {
    useEffect(() => {
        if (!flash) return;

        toast[flash.type.toLowerCase() as ToastTypes](flash.message);

        document.cookie = "flash=; Max-Age=0; path=/";
    }, [flash]);

    return null;
}

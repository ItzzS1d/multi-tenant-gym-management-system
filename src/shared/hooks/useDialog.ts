"use client";

import { use } from "react";
import { DialogContext } from "../contexts/dialog-context";

export function useDialog() {
    const context = use(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within DialogProvider");
    }
    return context;
}

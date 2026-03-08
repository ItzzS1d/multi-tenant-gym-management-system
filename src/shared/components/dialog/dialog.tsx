import { X } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { DialogConfig } from "@/shared/contexts/dialog-context";
import { cn } from "@/shared/lib/utils";

type DialogProps = Omit<DialogConfig, "content"> & {
    isOpen: boolean;
    onClose: () => void;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    padding?: boolean;
};

const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
} as const;

const Dialog = ({
    isOpen,
    onClose,
    title,
    footer,
    size = "medium",
    disableClose = false,
    titleIcon,
    titleDescription,
    children,
    type = "form",
    padding = true,
}: DialogProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !disableClose) onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose, disableClose]);

    const sizeClasses = {
        small: "max-w-md",
        medium: "max-w-lg",
        large: "max-w-2xl",
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop with Fade Exit */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
                        onClick={disableClose ? undefined : onClose}
                    />

                    {/* Dialog with Spring Exit */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 10,
                            transition: { duration: 0.15 },
                        }}
                        transition={springConfig}
                        className={cn(
                            "relative z-50 w-full flex flex-col max-h-[90vh] shadow-2xl",
                            "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden",
                            sizeClasses[size],
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                {titleIcon && (
                                    <div className="text-primary">
                                        {titleIcon}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <h3 className="font-medium text-lg text-slate-900 dark:text-white leading-tight">
                                        {title}
                                    </h3>
                                    {titleDescription && (
                                        <p className="text-xs text-slate-500">
                                            {titleDescription}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {!disableClose && (
                                <Button
                                    onClick={onClose}
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            )}
                        </div>

                        {/* Content */}
                        <div
                            className={cn("overflow-y-auto", padding && "p-4")}
                        >
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Dialog;

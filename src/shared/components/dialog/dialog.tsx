import { X } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { DialogConfig } from "@/shared/contexts/dialog-context";

type DialogProps = Omit<DialogConfig, "content"> & {
    isOpen: boolean;
    onClose: () => void;
    footer?: React.ReactNode;
    children?: React.ReactNode;
};

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
    type="form",
}: DialogProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    if (!isOpen) return null;

    if (type === "confirmation") {
        return (
            <AnimatePresence>
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
                        onClick={disableClose ? undefined : onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{
                            duration: 0.2,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative z-50 w-full max-w-md mx-4"
                    >
                        <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            {/* Modal Content */}
                            <div className="p-8 flex flex-col items-center text-center">
                                {/* Warning Icon Container */}
                                {titleIcon && (
                                    <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-destructive">
                                        {titleIcon}
                                    </div>
                                )}
                                {/* Heading */}
                                <h3
                                    className="text-xl font-bold text-slate-900 dark:text-white mb-3"
                                    id="modal-title"
                                >
                                    {title}
                                </h3>
                                {/* Description */}
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                                    {titleDescription}
                                </p>
                                {/* Details Card (Optional contextual info) */}
                                {children}
                            </div>
                            {/* Modal Footer / Actions */}
                            {footer && <div className="pb-4 ">{footer}</div>}
                        </div>
                        {/* Tooltip/Help Text */}
                        <p className="mt-4 text-center text-xs text-white/60">
                            Press{" "}
                            <kbd className="px-1.5 py-0.5 rounded bg-white/20 border border-white/10 text-white font-sans">
                                Esc
                            </kbd>{" "}
                            to dismiss this dialog.
                        </p>
                    </motion.div>
                </div>
            </AnimatePresence>
        );
    }

    const sizeClasses = {
        small: "max-w-md",
        medium: "max-w-lg",
        large: "max-w-2xl",
    };
    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-0"
                role="dialog"
                aria-modal="true"
            >
                {/*Back drop*/}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-[#0f2318]/40 dark:bg-black/60 backdrop-blur-xs transition-opacity"
                    onClick={disableClose ? undefined : onClose}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{
                        duration: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-[#1a2e24] rounded-[0.625rem] shadow-2xl transform transition-all flex flex-col max-h-[90vh]`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-2 px-4 border-b border-[#dbe3df] dark:border-[#4dff9d]/10">
                        <div className="text-lg font-medium text-[#0f2318] dark:text-white flex items-center gap-3">
                            <div className="text-primary bg-primary/20 p-2 rounded">
                                {titleIcon}
                            </div>
                            <div className="flex items-start flex-col">
                                {title}
                                <span className="text-gray-500 text-sm font-medium">
                                    {titleDescription}
                                </span>
                            </div>
                        </div>
                        {!disableClose && (
                            <Button
                                onClick={onClose}
                                variant={"ghost"}
                                size={"lg"}
                            >
                                <X />
                            </Button>
                        )}
                    </div>

                    <div className="p-4 overflow-y-auto">{children}</div>

                    {footer && (
                        <div className="px-6 py-4 border-t border-[#dbe3df] dark:border-[#4dff9d]/10 bg-gray-50 dark:bg-[#15251d] rounded-b-[0.625rem] flex justify-end gap-3">
                            {footer}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Dialog;

"use client";
import React, { createContext, ReactNode, useState } from "react";
import Dialog from "../components/dialog/dialog";

export interface DialogConfig {
    title: string;
    buttonTitle?: string;
    buttonIcon?: ReactNode;
    disableClose?: boolean;
    size?: "small" | "medium" | "large";
    content: ReactNode;
    isLoading?: boolean;
    titleIcon?: ReactNode;
    titleDescription?: string;
    type?: "confirmation" | "form";
    footer?: ReactNode;
}
interface DialogContextValue {
    openDialog: (config: DialogConfig) => void;
    closeDialog: () => void;
}
export const DialogContext = createContext<DialogContextValue | null>(null);

const DialogContextProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<DialogConfig | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = (newConfig: DialogConfig) => {
        setConfig(newConfig);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setConfig(null);
        setTimeout(() => setConfig(null), 300);
    };

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}
            {config && (
                <Dialog
                    isOpen={isOpen}
                    onClose={closeDialog}
                    title={config.title}
                    size={config.size}
                    disableClose={config.disableClose}
                    titleIcon={config.titleIcon}
                    titleDescription={config.titleDescription}
                    type={config.type}
                    footer={config.footer}
                >
                    {config.content}
                </Dialog>
            )}
        </DialogContext.Provider>
    );
};

export default DialogContextProvider;

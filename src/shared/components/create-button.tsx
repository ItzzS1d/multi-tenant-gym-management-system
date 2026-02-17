import React, { useEffect } from "react";

import { Button, buttonVariants } from "./ui/button";
import { Plus } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { useDialog } from "../hooks/useDialog";
import { DialogConfig } from "../contexts/dialog-context";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { useTopLoader } from "nextjs-toploader";

type BaseProps = {
    label: string;
    icon?: React.ReactNode;
    className?: string;
    size?: VariantProps<typeof buttonVariants>["size"];
    titleIcon?: React.ReactNode;
};
type DialogVariant = {
    dialog: DialogConfig;
    href?: never;
};
type LinkProps = {
    href: Route;
    dialog?: never;
};
type CreateButtonProps = BaseProps & (DialogVariant | LinkProps);

const CreateButton = ({
    label,
    icon,
    className,
    size,
    dialog,
    href,
}: CreateButtonProps) => {
    const { openDialog } = useDialog();
    const router = useRouter();
    const { start } = useTopLoader();

    const handleClick = () => {
        if (href) {
            start();
            router.push(href);
            return;
        }
        if (dialog) {
            openDialog(dialog);
        }
    };
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isTyping =
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement ||
                document.activeElement instanceof HTMLSelectElement ||
                (document.activeElement as HTMLInputElement).isContentEditable;
            if (!isTyping && event.key === "n") {
                handleClick();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClick]);
    return (
        <Button
            onClick={handleClick}
            className={cn("text-accent", className)}
            size={size}
        >
            {icon ? <>{icon}</> : <Plus />}
            {label}
        </Button>
    );
};

export default CreateButton;

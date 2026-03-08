"use client";
import { Button } from "../ui/button";
import { useDialog } from "@/shared/hooks/useDialog";
import { Spinner } from "../ui/spinner";
import { cn } from "@/shared/lib/utils";

interface ButtonProps {
    action?: () => void;
    actionBtnTitle: string;
    actionBtnIcon: React.ReactNode;
    isLoading?: boolean;
    loadingText?: string;
    className?: string;
}
const FormButtons = ({
    action,
    actionBtnTitle,
    actionBtnIcon,
    isLoading = false,
    loadingText = "Loading...",
    className,
}: ButtonProps) => {
    const { closeDialog } = useDialog();
    return (
        <div className="flex items-center gap-3  border-t shadow py-2 px-4 justify-end sticky inset-0">
            <Button variant={"outline"} onClick={closeDialog}>
                Cancel
            </Button>
            <Button type="submit" onClick={action} className={"text-accent"}>
                {isLoading ? (
                    <>
                        <Spinner className="text-accent" />
                        {loadingText}
                    </>
                ) : (
                    <div className="flex items-center gap-2 ">
                        {actionBtnIcon}
                        <span className={cn(className)}>{actionBtnTitle}</span>
                    </div>
                )}
            </Button>
        </div>
    );
};

export default FormButtons;

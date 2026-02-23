import React, { useEffect, useRef } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";
import { XCircle, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/shared/lib/utils";
import { ColumnFiltersColumn } from "@tanstack/react-table";

interface FilterTableInputProps {
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    placeholder: string;
}
const FilterTableInput = ({
    globalFilter,
    setGlobalFilter,
    placeholder,
    className,
}: FilterTableInputProps & { className?: string }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const handleFocus = (e: KeyboardEvent) => {
            const isTyping =
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement ||
                document.activeElement?.getAttribute("contenteditable");

            if (!isTyping && e.key === "/") {
                e.preventDefault();
                inputRef.current?.focus();
                console.info("Fireing");
            }
        };
        const handleBlur = (e: KeyboardEvent) => {
            if (
                document.activeElement === inputRef.current &&
                e.key === "Escape"
            ) {
                inputRef.current?.blur();
            }
        };
        const handleClearInput = (e: KeyboardEvent) => {
            if (document.activeElement === inputRef.current) return;

            const isTyping =
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement ||
                document.activeElement?.getAttribute("contenteditable");

            if (isTyping) return;

            if (e.ctrlKey && e.key.toLowerCase() === "c") {
                inputRef.current?.focus();
                setGlobalFilter("");
            }
        };
        window.addEventListener("keydown", handleFocus);
        window.addEventListener("keydown", handleBlur);
        window.addEventListener("keydown", handleClearInput);
        return () => {
            window.removeEventListener("keydown", handleFocus);
            window.removeEventListener("keydown", handleBlur);
            window.removeEventListener("keydown", handleClearInput);
        };
    }, []);
    return (
        <InputGroup className={cn("w-md", className)}>
            <InputGroupInput
                ref={inputRef}
                placeholder={placeholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
            {globalFilter && (
                <InputGroupAddon align={"inline-end"}>
                    <Button
                        variant={"ghost"}
                        onClick={() => setGlobalFilter("")}
                    >
                        <XCircle />
                    </Button>
                </InputGroupAddon>
            )}
        </InputGroup>
    );
};

export default FilterTableInput;

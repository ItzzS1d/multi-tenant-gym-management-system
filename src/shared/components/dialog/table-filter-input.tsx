import React from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";
import { XCircle, Search } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/shared/lib/utils";

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
    return (
        <InputGroup className={cn("w-md", className)}>
            <InputGroupInput
                placeholder={placeholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <InputGroupAddon>
                {globalFilter ? (
                    <Button
                        variant={"ghost"}
                        onClick={() => setGlobalFilter("")}
                    >
                        <XCircle />
                    </Button>
                ) : (
                    <Search />
                )}
            </InputGroupAddon>
        </InputGroup>
    );
};

export default FilterTableInput;

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { CoreInstance } from "@tanstack/react-table";

type SelectFilterProps<T> = {
    options: {
        label: string;
        value: string;
    }[];
    placeholder: string;
    onValueChange?: () => void;
    table: CoreInstance<T>;
    columnName: string;
};
export default function TableFilterSelect<T>({
    columnName,
    options,
    placeholder,
    onValueChange,
    table,
}: SelectFilterProps<T>) {
    const handleValueChange = (value: string | null) => {
        const column = table.getColumn(columnName);
        column?.setFilterValue(value === "all" ? undefined : value);
    };
    return (
        <Select
            items={options}
            onValueChange={onValueChange ?? handleValueChange}
        >
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent side="bottom" sideOffset={5}>
                {options.map((option, i) => (
                    <SelectItem key={i} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

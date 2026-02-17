import * as React from "react";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { format } from "date-fns";
import { cn, formatDate } from "@/shared/lib/utils";
type DatePickerProps = {
    value?: Date;
    onChange: (Date?: Date) => void;
    disabled?: boolean;
} & React.ComponentProps<typeof Popover>;

export function DatePicker({
    value,
    onChange,
    disabled,
    ...props
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant={"outline"}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between text-left font-normal h-[46px]",
                            "rounded-lg border border-[#cfe7d7] dark:border-[#2d4a35]",
                            "bg-[#f6f8f6] dark:bg-[#102216] text-[#0d1b12] dark:text-white",
                            "hover:bg-[#f0fdf4] dark:hover:bg-[#1c3022] focus:ring-1 focus:ring-[#c1f33d]",
                            !value && "text-gray-400",
                        )}
                    >
                        {value ? formatDate(value) : <span>Pick a Date</span>}
                        <CalendarIcon className="ml-2 h-4 w-4 text-[#4c9a66] " />
                    </Button>
                }
            ></PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    animate
                    hideWeekdays
                    {...props}
                    className="rounded-md border-none"
                />
            </PopoverContent>
        </Popover>
    );
}

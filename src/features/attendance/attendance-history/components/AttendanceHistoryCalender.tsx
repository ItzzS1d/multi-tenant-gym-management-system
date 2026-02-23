"use client";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import FullCalender from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from "@/shared/components/ui/combobox";
import { getAllMembersList } from "../queries";
import useSwr from "swr";
import { Button } from "@/shared/components/ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/shared/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/shared/components/ui/sheet";
import {
    CalendarDays,
    CalendarCheck,
    CalendarX,
    ChevronDown,
    Clock,
    LogIn,
    LogOut,
    Timer,
    TrendingUp,
    Users,
} from "lucide-react";
import { format, getDaysInMonth } from "date-fns";
import { useSearchParams } from "next/navigation";

// Type for the API response from getMonthlyAttendanceList
type AttendanceRecord = {
    attendanceDate: string;
    totalDuration: number | null;
    checkInAt: string | null;
    checkOutAt: string | null;
    gymMemberId: string;
};

type AttendanceResponse = {
    stats: {
        present: number;
        absent: number;
        attendancePercentage: number;
        averageDuration: number;
    };
    records: AttendanceRecord[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MONTHS = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

function formatMinutesToDuration(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${String(m).padStart(2, "0")}m`;
}

const STATUS_CONFIG = {
    present: {
        label: "Present",
        className: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    absent: {
        label: "Absent",
        className: "bg-red-500/10 text-red-600 border-red-500/20",
    },
};

const AttendanceHistoryCalender = ({
    membersListPromise,
    gymId,
}: {
    membersListPromise: ReturnType<typeof getAllMembersList>;
    gymId: string;
}) => {
    const membersList = use(membersListPromise);
    const calendarRef = useRef<FullCalender | null>(null);
    const now = new Date();
    const [month, setMonth] = useState(
        String(now.getMonth() + 1).padStart(2, "0"),
    );
    const [year, setYear] = useState(String(now.getFullYear()));
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
        null,
    );
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDateClick = (args: DateClickArg) => {
        setSelectedDate(args.date);
        setSheetOpen(true);
    };

    const apiMonth = parseInt(month) - 1;

    const { data, isLoading } = useSwr<AttendanceResponse>(
        selectedMemberId
            ? `/api/gyms/${gymId}/members/${selectedMemberId?.value ?? selectedMemberId}/attendance?month=${apiMonth}&year=${year}`
            : null,
        fetcher,
    );

    useEffect(() => {
        const dateString = `${year}-${month}-01`;
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.gotoDate(dateString);
        }
    }, [month, year]);

    const members = membersList
        ? membersList.map((member) => ({
              label: member.user.name,
              value: member.id,
              image: member.memberDetails?.image,
              phone: member.user.phone,
          }))
        : [
              {
                  label: "No members found",
                  value: "No members found",
              },
          ];

    // Build a set of present dates from real data for quick lookup
    const presentDatesSet = () => {
        if (!data?.records) return new Set<string>();
        return new Set(
            data.records.map((r) =>
                format(new Date(r.attendanceDate), "yyyy-MM-dd"),
            ),
        );
    };

    // Find the selected day's record from real data
    const selectedDateKey = selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : null;
    const selectedDayRecord = () => {
        if (!selectedDateKey || !data?.records) return null;
        return (
            data.records.find(
                (r) =>
                    format(new Date(r.attendanceDate), "yyyy-MM-dd") ===
                    selectedDateKey,
            ) ?? null
        );
    };
    const selectedDayStatus: "present" | "absent" = selectedDayRecord()
        ? "present"
        : "absent";

    const calendarEvents = () => {
        if (!selectedMemberId || !data?.records) return [];
        const totalDays = getDaysInMonth(
            new Date(parseInt(year), parseInt(month) - 1),
        );
        const events = [];
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;
            const isPresent = presentDatesSet().has(dateStr);
            events.push({
                start: dateStr,
                display: "background",
                backgroundColor: isPresent ? "#dcfce7" : "#fef2f2",
            });
        }
        return events;
    };

    return (
        <div>
            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                {/* Member Combobox */}
                <Combobox
                    items={members}
                    value={selectedMemberId}
                    onValueChange={(item) => {
                        setSelectedMemberId(item as string);
                    }}
                >
                    <ComboboxTrigger
                        render={
                            <Button
                                variant={"outline"}
                                className="w-full sm:w-72 justify-between font-normal"
                            >
                                <ComboboxValue placeholder="Select Member">
                                    {(item) =>
                                        item ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={item.image}
                                                        alt={item.label}
                                                    />
                                                    <AvatarFallback>
                                                        {item.label.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {item.label}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            "Select a member"
                                        )
                                    }
                                </ComboboxValue>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        }
                    />
                    <ComboboxContent className={"whitespace-nowrap"}>
                        <ComboboxInput
                            showTrigger={false}
                            placeholder="Search member by name or phone"
                            showClear
                        />
                        <ComboboxEmpty>No members found.</ComboboxEmpty>
                        <ComboboxList>
                            {(item) => (
                                <ComboboxItem key={item.value} value={item}>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={item.image}
                                                alt={item.label}
                                            />
                                            <AvatarFallback>
                                                {item.label.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {item.label}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {item.phone}
                                            </span>
                                        </div>
                                    </div>
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>

                {/* Year & Month Selects */}
                <div className="flex gap-2 items-center">
                    <Select value={year} onValueChange={(v) => v && setYear(v)}>
                        <SelectTrigger className="w-28">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={month}
                        onValueChange={(v) => v && setMonth(v)}
                    >
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTHS.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Status Key */}
            <div className="flex flex-wrap gap-5 items-center justify-center sm:justify-start mb-4 bg-card border rounded-xl p-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                    Status Key:
                </span>
                <div className="flex items-center gap-2">
                    <span className="size-4 rounded bg-green-100 border border-green-200" />
                    <span className="text-sm text-muted-foreground">
                        Attended
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="size-4 rounded bg-red-50 border border-red-500" />
                    <span className="text-sm text-muted-foreground">
                        Absent
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="size-4 rounded bg-card border border-dashed border-muted-foreground/30" />
                    <span className="text-sm text-muted-foreground">
                        No Record
                    </span>
                </div>
            </div>

            {!selectedMemberId ? (
                <>
                    <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-xl bg-muted/20">
                        <div className="p-4 rounded-full bg-primary/10 mb-4">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg">
                            No Member Selected
                        </h3>
                        <p className="text-muted-foreground">
                            Select a member to view their attendance history
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <div className="relative">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px] rounded-xl">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                                    <p className="text-sm text-muted-foreground">
                                        Loading attendance...
                                    </p>
                                </div>
                            </div>
                        )}
                        <FullCalender
                            ref={calendarRef}
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView={"dayGridMonth"}
                            dateClick={handleDateClick}
                            headerToolbar={false}
                            events={calendarEvents}
                            showNonCurrentDates={false}
                        />
                    </div>

                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetContent
                            side="right"
                            className="w-full sm:max-w-md p-0"
                        >
                            <SheetHeader className="px-6 pt-6 pb-4 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
                                        <CalendarDays className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <SheetTitle className="text-lg">
                                            Attendance Details
                                        </SheetTitle>
                                        <SheetDescription>
                                            {selectedDate
                                                ? format(
                                                      selectedDate,
                                                      "EEEE, MMMM d, yyyy",
                                                  )
                                                : ""}
                                        </SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>

                            {/* Status Badge */}
                            <div className="px-6 pt-4">
                                <span
                                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[selectedDayStatus].className}`}
                                >
                                    {STATUS_CONFIG[selectedDayStatus].label}
                                </span>
                            </div>

                            <div className="px-6 py-5 space-y-4 overflow-y-auto">
                                {!selectedDayRecord ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="flex items-center justify-center h-14 w-14 rounded-full bg-muted mb-4">
                                            <Clock className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">
                                            No attendance record
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            No check-in or check-out recorded
                                            for this day.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border bg-card p-4 space-y-3">
                                        {/* Check In */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-green-500/10">
                                                <LogIn className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Check In
                                                </p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {selectedDayRecord() &&
                                                    selectedDayRecord()
                                                        .checkInAt
                                                        ? format(
                                                              new Date(
                                                                  selectedDayRecord()
                                                                      .checkInAt,
                                                              ),
                                                              "hh:mm a",
                                                          )
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Check Out */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-red-500/10">
                                                <LogOut className="h-4 w-4 text-red-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Check Out
                                                </p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {selectedDayRecord.checkOutAt
                                                        ? format(
                                                              new Date(
                                                                  selectedDayRecord.checkOutAt,
                                                              ),
                                                              "hh:mm a",
                                                          )
                                                        : "Not checked out yet"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Total Duration */}
                                        <div className="flex items-center gap-3 pt-2 border-t">
                                            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
                                                <Timer className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Total Duration
                                                </p>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {selectedDayRecord.totalDuration !=
                                                    null
                                                        ? formatMinutesToDuration(
                                                              selectedDayRecord.totalDuration,
                                                          )
                                                        : "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </>
            )}
        </div>
    );
};

export default AttendanceHistoryCalender;

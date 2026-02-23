"use client";
import {
    Users,
    LogIn,
    LogOut,
    UserCheck,
    Search,
    XCircle,
    Clock,
} from "lucide-react";
import { Suspense, useState } from "react";
import { getMembersListAndAttendanceLog } from "../../attendance-queries";
import { StatsSection } from "@/shared/components/stats/stats-section";
import { StatsCardsSkeleton } from "@/shared/components/stats/stats-card-skeleton";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import MembersListResults from "./members-list-results";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/shared/components/ui/input-group";

const ATTENDANCE_STATUS_CONFIG = {
    totalPresent: {
        icon: <UserCheck size={14} />,
        description: "Members visited today",
    },
    currentlyInside: {
        icon: <LogIn size={14} />,
        description: "Active on gym floor",
    },
    checkedOut: {
        icon: <LogOut size={14} />,
        description: "Daily sessions ended",
    },
    yetToArrive: {
        icon: <Clock />,
        description: "Active members not yet seen",
    },
};

const PunchInOutStation = ({
    attendanceLogPromise,
}: {
    attendanceLogPromise: ReturnType<typeof getMembersListAndAttendanceLog>;
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="space-y-5">
            {/* Stats Cards */}
            <Suspense fallback={<StatsCardsSkeleton length={4} />}>
                <StatsSection
                    config={ATTENDANCE_STATUS_CONFIG}
                    promise={attendanceLogPromise}
                    gridCount={4}
                />
            </Suspense>

            {/* Punch Station Card */}
            <Card>
                <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Search size={18} className="text-primary" />
                        Quick Check-In / Check-Out Station
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <InputGroup className="mb-3">
                        <InputGroupAddon>
                            <Search size={16} />
                        </InputGroupAddon>
                        <InputGroupInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or phone number..."
                        />
                        {searchQuery && (
                            <InputGroupAddon align="inline-end">
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="cursor-pointer hover:text-foreground transition-colors"
                                >
                                    <XCircle size={16} />
                                </button>
                            </InputGroupAddon>
                        )}
                    </InputGroup>

                    {/* Member List */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {searchQuery ? "Search Results" : "Found Members"}
                        </p>
                        <Suspense
                            fallback={
                                <div className="py-10 text-center">
                                    Loading members...
                                </div>
                            }
                        >
                            <MembersListResults
                                promise={attendanceLogPromise}
                                searchQuery={searchQuery}
                            />
                        </Suspense>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PunchInOutStation;

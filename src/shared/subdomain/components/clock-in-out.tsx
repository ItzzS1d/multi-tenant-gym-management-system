"use client";

import { clockInOut } from "@/features/attendance/attendance-actions";
import { getCheckInCheckOutStatus } from "@/features/attendance/attendance-queries";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { Clock } from "lucide-react";
import { use } from "react";

const ClockInOut = ({
    attendanceStatusPromise,
}: {
    attendanceStatusPromise: ReturnType<typeof getCheckInCheckOutStatus>;
}) => {
    const attendance = use(attendanceStatusPromise);

    const { handleAction, loading } = useActionHandler();
    const handleClockInOut = async () => {
        const status =
            attendance?.checkInAt && !attendance?.checkOutAt ? "out" : "in";

        await handleAction(clockInOut, status);
    };

    return (
        <Button
            size={"sm"}
            className={"text-accent"}
            onClick={handleClockInOut}
            disabled={loading}
        >
            {loading ? <Spinner /> : <Clock />}
            {attendance?.checkInAt && !attendance?.checkOutAt
                ? "Clock Out"
                : "Clock In"}
        </Button>
    );
};

export default ClockInOut;

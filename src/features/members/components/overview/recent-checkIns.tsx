import { History } from "lucide-react";
import { getMemberOverViewDetails } from "../../new/queries";
import { use } from "react";
import { format, isToday } from "date-fns";

export default function RecentCheckIns({
    memberOverviewDetailsPromise,
}: {
    memberOverviewDetailsPromise: ReturnType<typeof getMemberOverViewDetails>;
}) {
    const memberDetails = use(memberOverviewDetailsPromise);
    return (
        <div className="bg-white  lg:col-span-1 rounded-xl p-5 shadow-sm border border-[#e7f3eb]">
            {" "}
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className=" text-primary">
                    <History />
                </span>
                Recent Check-ins
            </h3>
            <div className="relative pl-2 border-l-2 border-[#e7f3eb] space-y-6">
                {(memberDetails?.attendanceEntries.length ?? 0) > 0 ? (
                    memberDetails?.attendanceEntries.map((entry) => {
                        const checkInDate = new Date(entry.checkInAt);
                        const isCheckInToday = isToday(checkInDate);

                        return (
                            <div key={entry.checkInAt.toString()} className="relative pl-4">
                                <div
                                    className={`absolute -left-[13px] top-1 h-3 w-3 rounded-full border-2 border-white ${isCheckInToday
                                        ? "bg-primary"
                                        : "bg-gray-300"
                                        }`}
                                ></div>
                                <p className="text-sm font-bold text-gray-900">
                                    {isCheckInToday
                                        ? `Today, ${format(checkInDate, "hh:mm a")}`
                                        : format(checkInDate, "MMM d, hh:mm a")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {entry.recordedByName || "General Entry"}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500 pl-4">
                        No recent check-ins found.
                    </p>
                )}
            </div>
        </div>
    );
}

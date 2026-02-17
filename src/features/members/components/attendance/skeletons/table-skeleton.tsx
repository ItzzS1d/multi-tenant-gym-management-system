import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AttendanceLogTableSkeleton() {
    return (
        <div className="overflow-x-auto">
            {/* Header stays REAL */}
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Attendance Log</h3>
                <div className="flex gap-2 text-xs">
                    <Button variant={"link"}>Filter</Button>
                    <Button variant={"link"}>Export</Button>
                </div>
            </div>

            <table className="w-full text-left border-collapse">
                {/* Table head stays REAL */}
                <thead className="bg-[#f8fcf9] dark:bg-[#102216] text-xs">
                    <tr>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Check-in</th>
                        <th className="px-6 py-3">Check-out</th>
                        <th className="px-6 py-3">Duration</th>
                        <th className="px-6 py-3">Location</th>
                    </tr>
                </thead>

                {/* ONLY rows skeleton */}
                <tbody className="divide-y divide-[#e7f3eb] dark:divide-[#2a4034]">
                    {[...Array(7)].map((_, i) => (
                        <tr key={i}>
                            <td className="px-6 py-4">
                                <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="px-6 py-4">
                                <Skeleton className="h-4 w-20" />
                            </td>
                            <td className="px-6 py-4">
                                <Skeleton className="h-4 w-20" />
                            </td>
                            <td className="px-6 py-4">
                                <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="px-6 py-4">
                                <Skeleton className="h-4 w-28" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ONLY footer text skeleton */}
            <div className="flex justify-between items-center mt-4 text-xs">
                <Skeleton className="h-3 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-7 w-14" />
                </div>
            </div>
        </div>
    );
}

import { Skeleton } from "@/shared/components/ui/skeleton";
import { Receipt } from "lucide-react";

export default function PaymentHistoryTableSkeleton() {
    return (
        <div className="overflow-x-auto rounded-xl border border-[#e7f3eb]">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center py-2.5 px-4 bg-white border-b border-[#e7f3eb]">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-64 md:w-80" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-10" />
                </div>
            </div>

            <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8fcf9] dark:bg-[#102216] text-xs">
                    <tr>
                        <th className="px-4 py-4"><Skeleton className="h-3 w-16" /></th>
                        <th className="px-4 py-4"><Skeleton className="h-3 w-24" /></th>
                        <th className="px-4 py-4"><Skeleton className="h-3 w-20" /></th>
                        <th className="px-4 py-4"><Skeleton className="h-3 w-16" /></th>
                        <th className="px-4 py-4 text-right"><Skeleton className="h-3 w-16 ml-auto" /></th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-[#e7f3eb]">
                    {[...Array(5)].map((_, i) => (
                        <tr key={i} className={i % 2 !== 0 ? "bg-[#f8fcf9]" : "bg-white"}>
                            <td className="px-4 py-4"><Skeleton className="h-4 w-20" /></td>
                            <td className="px-4 py-4"><Skeleton className="h-4 w-32" /></td>
                            <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
                            <td className="px-4 py-4"><Skeleton className="h-4 w-16" /></td>
                            <td className="px-4 py-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer Skeleton */}
            <div className="flex justify-between items-center p-4 bg-[#f8fcf9] border-t">
                <Skeleton className="h-4 w-40" />
                <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
        </div>
    );
}

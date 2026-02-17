import { Skeleton } from "../ui/skeleton";

type Props = {
    rows?: number;
};

export default function TableSkeleton({ rows = 6 }: Props) {
    return (
        <div className="bg-surface-light  rounded-xl shadow-sm border overflow-hidden">
            {/* TABLE */}
            <div className="overflow-hidden">
                <table className="min-w-full divide-y">
                    {/* HEADER */}
                    <thead className="bg-gray-50 ">
                        <tr>
                            <th className="px-6 py-4">
                                <Skeleton className="h-4 w-24" />
                            </th>
                            <th className="px-6 py-4">
                                <Skeleton className="h-4 w-32" />
                            </th>
                            <th className="px-6 py-4">
                                <Skeleton className="h-4 w-20" />
                            </th>
                            <th className="px-6 py-4">
                                <Skeleton className="h-4 w-28" />
                            </th>
                            <th className="px-6 py-4">
                                <Skeleton className="h-4 w-24" />
                            </th>
                            <th className="px-6 py-4 text-right">
                                <Skeleton className="h-4 w-16 ml-auto" />
                            </th>
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y">
                        {Array.from({ length: rows }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-24" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-full max-w-[12rem]" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-16" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-28" />
                                </td>
                                <td className="px-6 py-4">
                                    <Skeleton className="h-4 w-20" />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Skeleton className="h-4 w-8 ml-auto" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FOOTER / PAGINATION */}
            <div className="bg-gray-50 dark:bg-black/20 px-6 py-4 border-t flex items-center justify-between">
                <Skeleton className="h-4 w-48" />

                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
            </div>
        </div>
    );
}

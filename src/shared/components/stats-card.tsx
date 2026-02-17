import { ReactNode } from "react";

export interface StatsCardProps {
    title: string;
    icon: ReactNode;
    value?: string | number;
    description: string;
}

export default function StatsCard({
    description,
    icon,
    title,
    value,
}: StatsCardProps) {
    return (
        <div>
            {/* Total Visits */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-lg font-medium ">{title}</p>
                    <span className="text-[10px] md:text-xs text-[#4c9a66] dark:text-text-sub-dark bg-[#e7f3eb] px-2 py-1 rounded whitespace-nowrap">
                        {icon}
                    </span>
                </div>
                <h4 className="text-3xl font-bold">{value}</h4>
                <p className="text-xs text-text-sub-light mt-2">
                    {description}
                </p>
            </div>
        </div>
    );
}

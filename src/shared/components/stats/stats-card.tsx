import { Skeleton } from "../ui/skeleton";
import { StatsConfig } from "./stats-section";

export type CardProps = StatsConfig & {
    value: string | number;
};
type StatsCardProps =
    | {
        status: "loading";
    }
    | {
        status: "success";
        data: CardProps;
    };
export default function StatsCard(props: StatsCardProps) {
    if (props.status === "loading") {
        return (
            <div className="bg-surface-light p-3 px-4 rounded-xl shadow-sm border border-[#e7f3eb] animate-pulse">
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-8 rounded" />
                </div>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
            </div>
        );
    }

    const { title, icon, value, description } = props.data;

    const valueString = String(value);
    const valueFontSize = valueString.length > 12 ? "text-2xl" : "text-3xl";

    return (
        <div className="bg-surface-light dark:bg-surface-dark p-3 px-4 rounded-xl shadow-sm border border-[#e7f3eb]">
            <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-medium capitalize">{title}</p>
                <span className="text-xs text-[#4c9a66] bg-[#e7f3eb] px-2 py-1 rounded">
                    {icon}
                </span>
            </div>
            <h4 className={`${valueFontSize} font-bold`}>{value}</h4>
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
        </div>
    );
}

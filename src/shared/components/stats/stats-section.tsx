import { Suspense } from "react";
import StatsCard from "./stats-card";
import { StatsGrid } from "./stats-card-grid";
import StatsDataUnwrapper from "./stats-data-unwrapper";
import { StatsConfigItem } from "@/app/s/[subdomain]/(main)/members/page";

type StatsSectionProps<T extends { stats: Record<string, string | number> }> = {
    promise: Promise<T>;
    items: StatsConfigItem[];
};

export function StatsSection<
    T extends { stats: Record<string, string | number> },
>({ promise, items }: StatsSectionProps<T>) {
    return (
        <Suspense
            fallback={
                <StatsGrid>
                    {items.map((item, i) => (
                        <StatsCard key={i} {...item} isLoading />
                    ))}
                </StatsGrid>
            }
        >
            <StatsDataUnwrapper promise={promise} items={items} />
        </Suspense>
    );
}

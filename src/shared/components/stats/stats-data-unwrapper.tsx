import { use } from "react";
import StatsCard from "./stats-card";
import { StatsGrid } from "./stats-card-grid";
import { StatsConfigItem } from "@/app/s/[subdomain]/(main)/members/page";

function StatsDataUnwrapper<
    T extends { stats: Record<string, string | number> },
>({ promise, items }: { promise: Promise<T>; items: StatsConfigItem[] }) {
    const data = use(promise);
    const stats = data.stats;
    console.info("Dsata", data);

    return (
        <StatsGrid>
            {items.map((item, i) => (
                <StatsCard
                    key={i}
                    {...item}
                    isLoading={false}
                    value={stats[item.statKey as keyof typeof stats]}
                />
            ))}
        </StatsGrid>
    );
}
export default StatsDataUnwrapper;

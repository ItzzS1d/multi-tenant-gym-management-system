import { use } from "react";
import { StatsGrid } from "./stats-card-grid";
import StatsCard from "./stats-card";

export type StatsConfig = {
    title?: string;
    icon: React.ReactNode;
    description?: string;
};
type StatsSectionProps<T extends { stats: Record<string, string | number> }> = {
    promise: Promise<T>;
    config: Record<string, StatsConfig>;
    gridCount?: number;
};

const formatTitle = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

export function StatsSection<
    T extends { stats: Record<string, string | number> },
>({ promise, config, gridCount }: StatsSectionProps<T>) {
    const data = use(promise);

    return (
        <StatsGrid gridCount={gridCount}>
            {Object.entries(config).map(([key, config]) => {
                const value = data.stats[key] ?? 0;

                return (
                    <StatsCard
                        key={key}
                        status="success"
                        data={{
                            title: config.title || formatTitle(key),
                            icon: config.icon,
                            value: value,
                            description: config.description,
                        }}
                    />
                );
            })}
        </StatsGrid>
    );
}

import { StatsGrid } from "./stats-card-grid";
import StatsCard, { StatsCardProps } from "./stats-card";

export const MembersStatsSkeleton = ({
    items,
}: {
    items: StatsCardProps[];
}) => {
    return (
        <StatsGrid>
            {items.map((item, i) => (
                <StatsCard key={i} {...item} />
            ))}
        </StatsGrid>
    );
};

import StatsCard from "./stats-card";
import { StatsGrid } from "./stats-card-grid";

export const StatsCardsSkeleton = ({ length }: { length: number }) => {
    return (
        <StatsGrid gridCount={length}>
            {Array.from({ length }).map((_, i) => (
                <StatsCard status="loading" key={i} />
            ))}
        </StatsGrid>
    );
};

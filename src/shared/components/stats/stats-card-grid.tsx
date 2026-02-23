export const StatsGrid = ({
    children,
    gridCount = 4,
}: {
    children: React.ReactNode;
    gridCount?: number;
}) => {
    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 lg:[grid-template-columns:repeat(var(--grid-count),minmax(0,1fr))]"
            style={{ "--grid-count": gridCount } as React.CSSProperties}
        >
            {children}
        </div>
    );
};

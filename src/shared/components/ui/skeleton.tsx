import { cn } from "@/shared/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            className={cn(
                "relative overflow-hidden rounded-md",
                // Base: Darker than --muted. Mixes 12% foreground for a solid "Gym Gray"
                "bg-[color-mix(in_oklch,var(--foreground)_12%,var(--background))]",
                // The Sweep: A bright white streak that pops against the darker gray
                "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
                "after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent",
                className,
            )}
            {...props}
        />
    );
}

export { Skeleton };

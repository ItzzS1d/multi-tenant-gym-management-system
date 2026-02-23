import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatDate } from "@/shared/lib/utils";
import { ArrowUpRight, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUserJoinedGymList } from "../queries";
import { constructUrl } from "@/shared/lib/server-utils";

interface JoinedGymListCardProps {
    data: Awaited<ReturnType<typeof getUserJoinedGymList>>[number];
}

const JoinedGymListCard = ({ data }: JoinedGymListCardProps) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50">
            <div className="h-28 bg-linear-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-950 relative">
                <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
                {/* Role Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <Badge
                        variant={
                            data.role === "owner" ? "default" : "secondary"
                        }
                        className="capitalize shadow-sm/50 backdrop-blur-md"
                    >
                        {data.role}
                    </Badge>
                </div>
            </div>
            <CardContent className="px-6 pb-6 pt-0 relative">
                <div className="flex justify-between items-end -mt-12 mb-4">
                    <div className="h-24 w-24 rounded-2xl bg-background shadow-xl ring-4 ring-background overflow-hidden flex items-center justify-center relative">
                        {data.gym.logo ? (
                            <Image
                                src={data.gym.logo}
                                alt={data.gym.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Building2 className="h-10 w-10 text-muted-foreground/50" />
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="font-bold text-2xl leading-none truncate tracking-tight">
                            {data.gym.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Member since {formatDate(data.joinedOn)}
                        </p>
                    </div>

                    <Link
                        href={constructUrl("/dashboard", data.gym.slug)}
                        className="flex items-center gap-1 "
                    >
                        <Button
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-accent"
                            size="lg"
                        >
                            Launch Dashboard
                            <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default JoinedGymListCard;

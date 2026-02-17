import MembersTable from "@/features/members/directory/components/member-table";
import { MEMBERS_TABLE_COLUMNS } from "@/features/members/directory/components/member-table-colums";
import { getMemberList } from "@/features/members/directory/queries";
import { getPlansList } from "@/features/members/new/queries";
import { StatsCardProps } from "@/shared/components/stats/stats-card";
import { StatsSection } from "@/shared/components/stats/stats-section";
import TableSkeleton from "@/shared/components/table/table-skeleton";
import { Timer, UserPlus, Users } from "lucide-react";
import { Suspense } from "react";

export type StatsConfigItem = Omit<StatsCardProps, "isLoading" | "value"> & {
    statKey: string;
};
const MEMBER_STATS_CONFIG = [
    {
        title: "Total Members",
        icon: <Users size={20} />,
        description: "Total number of members",
        statKey: "totalMembers",
    },
    {
        title: "New This Month",
        icon: <UserPlus size={20} />,
        description: "Members Joined this month",
        statKey: "newThisMonth",
    },
    {
        title: "Expiring Soon",
        icon: <Timer size={20} />,
        description: "Members Membership Expiring soon",
        statKey: "expiringSoon",
    },
] as const satisfies StatsConfigItem[];

const Members = () => {
    const membersPromise = getMemberList();
    const plansPromise = getPlansList();
    return (
        <main className="space-y-1">
            <StatsSection
                promise={membersPromise}
                items={MEMBER_STATS_CONFIG}
            />
            <Suspense fallback={<TableSkeleton />}>
                <MembersTable
                    columns={MEMBERS_TABLE_COLUMNS}
                    membersListPromise={membersPromise}
                    plansListPromise={plansPromise}
                />
            </Suspense>
        </main>
    );
};

export default Members;

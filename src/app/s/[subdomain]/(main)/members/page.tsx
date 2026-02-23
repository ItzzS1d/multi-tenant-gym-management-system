import MembersTable from "@/features/members/directory/components/member-table";
import { MEMBERS_TABLE_COLUMNS } from "@/features/members/directory/components/member-table-colums";
import { getMemberList } from "@/features/members/directory/queries";
import { getPlansList } from "@/features/members/new/queries";
import { StatsSection } from "@/shared/components/stats/stats-section";
import { StatsCardsSkeleton } from "@/shared/components/stats/stats-card-skeleton";
import TableSkeleton from "@/shared/components/table/table-skeleton";
import { Timer, UserPlus, Users } from "lucide-react";
import { Suspense } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Members",
    description: "Manage your gym members, view their status, and add new ones.",
};

const MEMBER_STATS_CONFIG = {
    totalMembers: {
        icon: <Users size={14} />,
        description: "Total number of members",
    },
    newThisMonth: {
        icon: <UserPlus size={14} />,
        description: "Members joined this month",
    },
    expiringSoon: {
        icon: <Timer size={14} />,
        description: "Memberships expiring soon",
    },
};

const Members = () => {
    const membersPromise = getMemberList();
    const plansPromise = getPlansList();
    return (
        <main className="space-y-5">
            <Suspense fallback={<StatsCardsSkeleton length={3} />}>
                <StatsSection
                    config={MEMBER_STATS_CONFIG}
                    promise={membersPromise}
                    gridCount={3}
                />
            </Suspense>
            <Suspense fallback={<TableSkeleton />}>
                <MembersTable
                    columns={MEMBERS_TABLE_COLUMNS}
                    data={membersPromise.then((res) => res.records)}
                    plansListPromise={plansPromise}
                />
            </Suspense>
        </main>
    );
};

export default Members;

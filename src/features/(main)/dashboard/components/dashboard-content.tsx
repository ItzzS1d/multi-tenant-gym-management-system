import { use } from "react";
import { getUserJoinedGymList, getUserPendingInvitesList } from "../queries";
import { ArrowRight, Building2, Mail } from "lucide-react";
import Link from "next/link";
import JoinedGymListCard from "./joined-gym-list-card";
import InvitationsListCard from "./invitations-list-card";
import InvitationEmptyState from "./invitations-empty-state";
import { formatDate } from "@/shared/lib/utils";
import InvitationListRefreshButtons from "./invitation-list-refresh-btn";
import { currentUser } from "@/shared/lib/session";

interface DashboardContentProps {
    userPromise: ReturnType<typeof currentUser>;
    invitaionListPromise: ReturnType<typeof getUserPendingInvitesList>;
    joinedGymListPromise: ReturnType<typeof getUserJoinedGymList>;
}

export default function DashboardContent({
    userPromise,
    invitaionListPromise,
    joinedGymListPromise,
}: DashboardContentProps) {
    const invitations = use(invitaionListPromise);
    const joinedGyms = use(joinedGymListPromise);
    const { user } = use(userPromise);

    const hasInvites = invitations.length > 0;
    const hasGyms = joinedGyms.length > 0;
    const isOwner = joinedGyms.some((gym) => gym.role === "owner");

    // Empty state check
    if (!hasInvites && !hasGyms) {
        return <InvitationEmptyState />;
    }

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {greeting()}, {user.name}
                    </h1>
                    <p className="text-muted-foreground">
                        Here&apos;s an overview of your fitness network
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground hidden md:block border-r pr-3 mr-1 h-4 leading-4">
                        {formatDate(new Date())}
                    </p>
                    <InvitationListRefreshButtons />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area - 2/3 width on large screens */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Gyms Section */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-primary" />
                                Your Gyms
                            </h2>
                        </div>

                        {hasGyms ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {joinedGyms.map((gym) => (
                                    <JoinedGymListCard
                                        key={gym.id}
                                        data={gym}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 border border-dashed rounded-xl bg-muted/30 flex flex-col items-center justify-center text-center gap-2">
                                <Building2 className="h-8 w-8 text-muted-foreground/50 mb-2" />
                                <h3 className="font-medium">
                                    No active memberships
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    You haven&apos;t joined any gyms yet. Accept
                                    an invitation or create your own.
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar Area - 1/3 width on large screens */}
                <div className="space-y-6">
                    {/* Pending Invitations */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Mail className="h-5 w-5 text-orange-500" />
                                Invitations
                            </h2>
                            {hasInvites && (
                                <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {invitations.length} new
                                </span>
                            )}
                        </div>

                        {hasInvites ? (
                            <div className="flex flex-col gap-3">
                                {invitations.map((invitation) => (
                                    <InvitationsListCard
                                        key={invitation.id}
                                        invitation={invitation}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 border rounded-xl bg-card text-center">
                                <p className="text-sm text-muted-foreground">
                                    No pending invitations
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Create Gym CTA - Show if not owner */}
                    {!isOwner && (
                        <div className="p-5 rounded-xl bg-linear-to-br from-primary/10 via-primary/5 to-background border border-primary/20 space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-primary text-lg">
                                    Own a gym?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Create your own workspace to manage members,
                                    attendance, and payments.
                                </p>
                            </div>
                            <Link
                                href="/onboarding"
                                className="w-full  flex items-center group"
                            >
                                Create Gym
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

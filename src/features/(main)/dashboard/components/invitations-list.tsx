import { use } from "react";
import { Mail, Building, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getUserJoinedGymList, getUserPendingInvitesList } from "../queries";
import InvitationEmptyState from "./invitations-empty-state";
import InvitationsListCard from "./invitations-list-card";
import { Button } from "@/shared/components/ui/button";
import JoinedGymListCard from "./joined-gym-list-card";
import InvitationListRefreshButtons from "./invitation-list-refresh-btn";

const InvitationList = ({
    invitaionListPromise,
    joinedGymListPromise,
}: {
    invitaionListPromise: ReturnType<typeof getUserPendingInvitesList>;
    joinedGymListPromise: ReturnType<typeof getUserJoinedGymList>;
}) => {
    // Stream data from server promises
    const invitations = use(invitaionListPromise);
    const joinedGyms = use(joinedGymListPromise);

    const hasInvites = invitations.length > 0;
    const hasGyms = joinedGyms.length > 0;

    // Determine if the user is already an owner of any gym
    const isAlreadyOwner = joinedGyms.some((gym) => gym.role === "owner");

    // STATE 1: TOTAL EMPTY STATE (No Gyms AND No Invites)
    if (!hasInvites && !hasGyms) {
        return <InvitationEmptyState />;
    }

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto p-6 gap-10">
            {/* 1. PENDING INVITATIONS SECTION */}
            {hasInvites && (
                <section className="space-y-4">
                    <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <Mail className="text-primary h-5 w-5" />
                        Pending Invitations
                    </h1>
                    <div className="grid gap-3">
                        {invitations.map((invitation) => (
                            <InvitationsListCard
                                key={invitation.id}
                                invitation={invitation}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* 2. ACTIVE GYMS SECTION */}
            {hasGyms && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <Building className="text-primary h-5 w-5" />
                            Your Active Gyms
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {joinedGyms.map((gym) => (
                            <JoinedGymListCard key={gym.id} data={gym} />
                        ))}
                    </div>
                </section>
            )}

            {/* 3. THE GROWTH PITCH: Only show if they ARE NOT an owner yet */}
            {!isAlreadyOwner && (
                <div className="mt-4 p-8 border-2 border-dashed rounded-2xl bg-muted/30 flex flex-col items-center text-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                        <h3 className="text-lg font-bold">
                            Start your own fitness club
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Ready to lead? Create your own gym instance, manage
                            staff, and track your business growth today.
                        </p>
                    </div>
                    <Button>
                        <Link href="/onboarding" className="gap-2">
                            Start yours today <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )}

            {/* 4. REFRESH & UTILITY */}
            <div className="flex flex-col items-center gap-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground italic">
                    Waiting for an invitation?
                </p>
                <InvitationListRefreshButtons />
            </div>
        </div>
    );
};

export default InvitationList;

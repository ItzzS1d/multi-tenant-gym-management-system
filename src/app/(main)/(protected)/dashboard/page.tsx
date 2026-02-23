import DashboardContent from "@/features/(main)/dashboard/components/dashboard-content";
import { DashboardSkeleton } from "@/features/(main)/dashboard/components/skeleton/dashboard-skeleton";
import {
    getUserJoinedGymList,
    getUserPendingInvitesList,
} from "@/features/(main)/dashboard/queries";
import { currentUser } from "@/shared/lib/session";
import React, { Suspense } from "react";

const RootDashboard = async () => {
    const invitaionsListPromise = getUserPendingInvitesList();
    const joinedGymListPromise = getUserJoinedGymList();
    const userPromise = currentUser();
    return (
        <main className="container mx-auto mt-5 px-4 md:px-6">
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardContent
                    userPromise={userPromise}
                    invitaionListPromise={invitaionsListPromise}
                    joinedGymListPromise={joinedGymListPromise}
                />
            </Suspense>
        </main>
    );
};

export default RootDashboard;

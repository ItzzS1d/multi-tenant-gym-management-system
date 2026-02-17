import React, { Suspense } from "react";
import ContactInfoSkeleton from "./skeletons/contact-info-skeleton";
import ContactInfo from "./contact-info";
import MembershipCard from "./membership-card";
import MembershipCardSkeleton from "./skeletons/membership-card-skeleton";
import StaffNotes from "./staff-notes";
import RecentCheckIns from "./recent-checkIns";
import RecentCheckInsSkeleton from "./skeletons/recent-checkIns-skeleton";
import StaffNotesContentSkeleton from "./skeletons/staff-notes-skeleton";
import { getMemberNotes, getMemberOverViewDetails } from "../../new/queries";

import { currentUser } from "@/shared/lib/session";

const OverViewTab = async ({
    memberOverviewPromise,
    memberNotesPromise,
    memberId,
    memberName,
}: {
    memberOverviewPromise: ReturnType<typeof getMemberOverViewDetails>;
    memberNotesPromise: ReturnType<typeof getMemberNotes>;
    memberId: string;
    memberName: string;
}) => {
    const user = await currentUser();
    const staffName = user.user.name || "Staff";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2 lg:col-span-2">
                <Suspense fallback={<ContactInfoSkeleton />}>
                    <ContactInfo
                        memberOverviewPromise={memberOverviewPromise}
                    />
                </Suspense>
                <div className="space-y-6">
                    <Suspense fallback={<StaffNotesContentSkeleton />}>
                        <StaffNotes
                            memberNotesPromise={memberNotesPromise}
                            staffName={staffName}
                            member={{
                                id: memberId,
                                name: memberName,
                            }}
                        />
                    </Suspense>
                </div>
            </div>

            <div className="space-y-6">
                <Suspense fallback={<MembershipCardSkeleton />}>
                    <MembershipCard
                        memberOverviewDetailsPromise={memberOverviewPromise}
                    />
                </Suspense>

                <Suspense fallback={<RecentCheckInsSkeleton />}>
                    <RecentCheckIns
                        memberOverviewDetailsPromise={memberOverviewPromise}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default OverViewTab;

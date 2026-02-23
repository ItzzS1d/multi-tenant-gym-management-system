import { INVITATION_TABLE_COLUMNS } from "@/features/staff/invitations/components/invitation-table-columns";
import { getInvitationsList } from "@/features/staff/invitations/invitations-queries";
import InvitationsTable from "@/features/staff/invitations/components/invitations-table";
import TableSkeleton from "@/shared/components/table/table-skeleton";
import React, { Suspense } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Invitations",
    description: "Manage staff invitations and role assignments.",
};

const Invitaions = () => {
    const getInvitationsListPromise = getInvitationsList();
    return (
        <Suspense fallback={<TableSkeleton />}>
            <InvitationsTable
                invitationsListPromise={getInvitationsListPromise}
                columns={INVITATION_TABLE_COLUMNS}
            />
        </Suspense>
    );
};

export default Invitaions;

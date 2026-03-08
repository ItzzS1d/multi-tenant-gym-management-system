"use client";
import {
    accepteStaffInvitation,
    revokeInvitation,
} from "@/features/staff/invitations/invitation-actions";
import { Button } from "@/shared/components/ui/button";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { ArrowRight } from "lucide-react";

const InvitationActions = ({ invitationId }: { invitationId: string }) => {
    const { handleAction, loading } = useActionHandler();
    const handleReject = async () => {
        await handleAction(revokeInvitation, { id: invitationId });
    };
    const handleAccept = async () => {
        await handleAction(accepteStaffInvitation, { id: invitationId });
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={"outline"}
                disabled={loading}
                onClick={handleReject}
            >
                {loading ? "Processing..." : "Decline"}
            </Button>
            <Button
                className={"group flex items-center gap-2"}
                onClick={handleAccept}
                disabled={loading}
            >
                {loading ? "Processing..." : "Accept"}
                <ArrowRight className="group:hover:translate-x-1 duration-150 transition-transform" />
            </Button>
        </div>
    );
};

export default InvitationActions;

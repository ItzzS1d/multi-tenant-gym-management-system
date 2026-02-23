"use client";
import { Button } from "@/shared/components/ui/button";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { accepteStaffInvitation } from "../invitation-actions";

type AccepteInvitationFlowProps = {
    invitationId: string;
};
export default function AccepteInvitationFlow({
    invitationId,
}: AccepteInvitationFlowProps) {
    const { handleAction, loading } = useActionHandler();
    const handleInvitationAccept = async () => {
        await handleAction(accepteStaffInvitation, {
            id: invitationId,
        });
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-svh space-y-8">
            <div className="bg-surface-light p-8 sm:p-10   w-full max-w-lg shadow-xl rounded-xl overflow-hidden border border-slate-200 ">
                <Button onClick={handleInvitationAccept}>
                    Accept Invitation
                </Button>
            </div>
        </main>
    );
}

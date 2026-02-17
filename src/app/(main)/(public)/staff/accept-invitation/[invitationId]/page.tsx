import AccepteInvitationFlow from "@/features/staff/invitations/components/accepte-invitation-flow";
import { getInvitationDetails } from "@/features/staff/invitations/queries";

const AccepteInvidationId = async ({
    params,
}: Readonly<PageProps<"/staff/accept-invitation/[invitationId]">>) => {
    const { invitationId } = await params;
    const invitationDetails = await getInvitationDetails(invitationId);

    if (invitationDetails && invitationDetails?.type === "ERROR") {
        return (
            <div className="flex flex-col items-center justify-center min-h-svh">
                <h1 className="text-2xl font-bold">Invitation Not Found</h1>
                <p className="text-muted-foreground">
                    {invitationDetails.message}
                </p>
            </div>
        );
    }

    return (
        <AccepteInvitationFlow
            invitationDetails={invitationDetails?.invitation}
            invitationId={invitationId}
        />
    );
};

export default AccepteInvidationId;

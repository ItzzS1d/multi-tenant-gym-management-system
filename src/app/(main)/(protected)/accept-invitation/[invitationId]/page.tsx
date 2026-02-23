import AccepteInvitationFlow from "@/features/staff/invitations/components/accepte-invitation-flow";
import * as z from "zod";

const AccepteInvidationId = async ({
    params,
}: Readonly<PageProps<"/accept-invitation/[invitationId]">>) => {
    const { invitationId } = await params;
    const { success } = z.cuid().safeParse(invitationId);
    if (!success) {
        return <h1>Invalid Invitation ID</h1>;
    }

    return <AccepteInvitationFlow invitationId={invitationId} />;
};

export default AccepteInvidationId;

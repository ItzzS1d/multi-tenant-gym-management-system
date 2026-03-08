import { Mail } from "lucide-react";
import InvitationActions from "./invitations-list-card-actions";
import { getUserPendingInvitesList } from "../queries";
import { capitalize } from "@/shared/lib/utils";

const InvitationsListCard = ({
    invitation,
}: {
    invitation: Awaited<ReturnType<typeof getUserPendingInvitesList>>[number];
}) => {
    return (
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 space-y-1">
                    <h4 className="font-semibold leading-none">
                        {invitation.organizationName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Invited you to join as{" "}
                        <span className="font-medium text-foreground">
                            {capitalize(invitation.role)}
                        </span>
                    </p>
                </div>
            </div>
            <div className="mt-4 pl-14 ">
                <InvitationActions invitationId={invitation.id} />
            </div>
        </div>
    );
};

export default InvitationsListCard;

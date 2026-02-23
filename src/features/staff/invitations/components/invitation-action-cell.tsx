import { InvitationColumnProps } from "./invitation-table-columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import {
    Ban,
    Copy,
    Ellipsis,
    ReceiptText,
    RefreshCw,
    Trash,
    TriangleAlert,
} from "lucide-react";
import { capitalize, rootDomainWithProtocolClient } from "@/shared/lib/utils";
import { toast } from "sonner";
import { useDialog } from "@/shared/hooks/useDialog";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import {
    deleteInvitation,
    resendInvitation,
    revokeInvitation,
} from "../invitation-actions";
import { useRouter } from "next/navigation";
import { Spinner } from "@/shared/components/ui/spinner";

interface InvitationActionCellProps {
    data: InvitationColumnProps;
}
const InvitationActionCell = ({ data }: InvitationActionCellProps) => {
    const { openDialog, closeDialog } = useDialog();
    const router = useRouter();
    const { handleAction, loading } = useActionHandler();
    const handleCopyLinkToClipboard = async () => {
        const inviteLink = `${rootDomainWithProtocolClient}/staff/accept-invitation/${data.id}`;
        navigator.clipboard.writeText(inviteLink);

        toast.success("Link copied to clipboard");
    };
    const confirmDelete = async (invitationId: string) => {
        handleAction(deleteInvitation, invitationId);
        router.refresh();
        closeDialog();
    };
    const handleDelete = async () => {
        openDialog({
            type: "confirmation",
            title: "Delete Invitation",
            titleDescription:
                "Are you sure you want to delete this invitation? Once deleted, it cannot be recovered.",
            titleIcon: <TriangleAlert />,
            content: (
                <div className="mt-6 w-full p-4 bg-slate-50 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                            <ReceiptText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                                Invited Staff Name
                            </p>
                            <p className="text-sm font-semibold text-gray-500 ">
                                {data.firstName} {data.lastName}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                            ROLE
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {capitalize(data.role)}
                        </p>
                    </div>
                </div>
            ),
            footer: (
                <div className="flex justify-center gap-5 w-full">
                    <Button variant={"ghost"} className={"w-30"}>
                        Cancel
                    </Button>
                    <Button
                        variant={"destructive"}
                        onClick={() => confirmDelete(data.id)}
                        className={"w-30"}
                    >
                        Delete
                    </Button>
                </div>
            ),
        });
    };
    const handleResend = async (invitationId: string) => {
        await handleAction(resendInvitation, { id: invitationId });
    };
    const handleRevoke = async (invitationId: string) => {
        await handleAction(revokeInvitation, { id: invitationId });
    };
    return loading ? (
        <Spinner />
    ) : (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost">
                        <Ellipsis />
                    </Button>
                }
            />
            <DropdownMenuContent className="whitespace-nowrap w-50">
                {/* ONLY SHOW IF PENDING OR EXPIRED */}
                {(data.status === "pending" || data.status === "expired") && (
                    <>
                        <DropdownMenuItem
                            className="justify-between"
                            onClick={() => handleResend(data.id)}
                        >
                            Resend Invitation
                            <RefreshCw />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="justify-between"
                            onClick={handleCopyLinkToClipboard}
                        >
                            Copy Invitation Link
                            <Copy />
                        </DropdownMenuItem>
                    </>
                )}

                {/* ONLY SHOW IF STILL ACTIVE/PENDING - Not for expired/revoked */}
                {data.status === "pending" && (
                    <DropdownMenuItem
                        className="justify-between"
                        onClick={() => handleRevoke(data.id)}
                    >
                        Revoke Invitation
                        <Ban />
                    </DropdownMenuItem>
                )}

                {/* ALWAYS SHOW FOR CLEANUP */}
                <DropdownMenuItem
                    className="justify-between"
                    variant="destructive"
                    onClick={handleDelete}
                >
                    Delete Invitation
                    <Trash />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default InvitationActionCell;

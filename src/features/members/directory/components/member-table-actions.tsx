"use client";

import {
    Pencil,
    User,
    ShieldAlert,
    ShieldCheck,
    RefreshCw,
    EllipsisVertical,
    UserCog,
} from "lucide-react";
import { MemberTableColumnProps } from "./member-table-colums";
import { Table } from "@tanstack/react-table";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useDialog } from "@/shared/hooks/useDialog";
import MembershipRenewalForm from "./membership-renewal-form";
import AssignTrainerForm from "./assign-trainer-form";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { toggleMemberStatusAction } from "../../new/member-actions";
import EditMemberForm from "./edit-member-form";
import { Button } from "@/shared/components/ui/button";
import { Route } from "next";

interface MemberTableActionsProps {
    member: MemberTableColumnProps;
}

export const MemberTableActions = ({ member }: MemberTableActionsProps) => {
    const { openDialog } = useDialog();
    const {
        handleAction,
        loading: isStatusChanging,
        router,
    } = useActionHandler();

    const onToggleStatus = async () => {
        await handleAction(toggleMemberStatusAction, {
            memberId: member.id,
            isActive: member.status !== "ACTIVE",
        });
    };

    const onEditDetails = () => {
        openDialog({
            title: "Edit Member Details",
            titleDescription: `Update personal and contact information for ${member.firstName} ${member.lastName}.`,
            titleIcon: <Pencil size={20} />,
            content: <EditMemberForm memberId={member.id} />,
            size: "large",
        });
    };

    const onAssignTrainer = () => {
        const isChanging = !!member.assignedTrainerId;
        openDialog({
            title: isChanging ? "Change Trainer" : "Assign Trainer",
            titleDescription: isChanging
                ? `Update the assigned trainer for ${member.firstName} ${member.lastName}.`
                : `Link a personal trainer to ${member.firstName} ${member.lastName}.`,
            titleIcon: <UserCog size={20} />,
            content: (
                <AssignTrainerForm
                    memberId={member.id}
                    currentTrainerId={member.assignedTrainerId}
                />
            ),
            size: "medium",
        });
    };

    const onRenewMembership = () => {
        openDialog({
            title: "Renew Membership",
            titleDescription: `Select a new plan and record the payment for ${member.firstName} ${member.lastName}.`,
            titleIcon: <RefreshCw size={20} />,
            content: <MembershipRenewalForm memberId={member.id} />,
            size: "medium",
        });
    };
    console.info(member);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <EllipsisVertical className="h-4 w-4" />
                    </Button>
                }
            />
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                        router.push(`/members/${member.id}` as Route)
                    }
                >
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={onAssignTrainer}
                >
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>
                        {member.assignedTrainerId
                            ? "Change Trainer"
                            : "Assign Trainer"}
                    </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={onEditDetails}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit Details</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={onRenewMembership}
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Renew Plan</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className={`cursor-pointer ${
                        member.status === "ACTIVE"
                            ? "text-destructive focus:text-destructive"
                            : "text-green-600 focus:text-green-600"
                    }`}
                    onClick={onToggleStatus}
                    disabled={isStatusChanging}
                >
                    {member.status === "ACTIVE" ? (
                        <>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                        </>
                    ) : (
                        <>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                        </>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

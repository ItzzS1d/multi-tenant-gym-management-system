"use client";

import { getMembersListAndAttendanceLog } from "../../attendance-queries";
import { punchMember } from "../../attendance-actions";
import { UserCheck, LogOut, LogIn, UserPlus } from "lucide-react";
import { use } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Spinner } from "@/shared/components/ui/spinner";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import Link from "next/link";
import { getInitials } from "@/shared/lib/utils";

interface MembersListResultProps {
    promise: ReturnType<typeof getMembersListAndAttendanceLog>;
    searchQuery: string;
}
const MembersListResults = ({
    promise,
    searchQuery,
}: MembersListResultProps) => {
    const list = use(promise);
    const { handleAction, loading } = useActionHandler();

    const filteredMembers =
        list?.allMembers.filter(
            (member) =>
                member.user.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                member.user.phone.includes(searchQuery.toLowerCase()),
        ) || list;

    ;

    const handlePunch = async (memberId: string, status: "in" | "out") => {
        await handleAction(punchMember, { memberId, status }, {
            successMessage:
                status === "in"
                    ? "Member checked in!"
                    : "Member checked out!",
        });
    };

    return (
        <>
            {searchQuery ? (
                <div className="space-y-2">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => {
                            const isInside = member.attendance?.isInsideGym;
                            const isFinished = member.attendance?.isFinished;

                            return (
                                <div
                                    key={member.user.Id}
                                    className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${isFinished
                                                    ? "bg-primary/15 text-primary"
                                                    : isInside
                                                        ? "bg-green-500/15 text-green-600"
                                                        : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                {getInitials(member.user.name)}
                                            </div>

                                            {isInside && (
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                {member.user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                +91 {member.user.phone}
                                            </p>
                                        </div>
                                    </div>

                                    {isFinished ? (
                                        <Badge
                                            variant="active"
                                            className="h-8 px-3"
                                        >
                                            <UserCheck size={14} />
                                            Completed
                                        </Badge>
                                    ) : (
                                        <Button
                                            size="sm"
                                            className="gap-1.5"
                                            variant={
                                                isInside ? "outline" : "default"
                                            }
                                            disabled={loading}
                                            onClick={() =>
                                                handlePunch(
                                                    member.member.memberId,
                                                    isInside ? "out" : "in",
                                                )
                                            }
                                        >
                                            {loading ? (
                                                <Spinner />
                                            ) : isInside ? (
                                                <>
                                                    <LogOut size={14} />
                                                    Check Out
                                                </>
                                            ) : (
                                                <>
                                                    <LogIn size={14} />
                                                    Check In
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-6 space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                No members found
                            </p>
                            <Link
                                href="/members/new"
                                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                            >
                                <UserPlus size={18} />
                                Register &quot;{searchQuery}&quot;
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-6 border-2 border-dashed rounded-xl space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Start typing to find members
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                        Search by name or phone number
                    </p>
                </div>
            )}
        </>
    );
};

export default MembersListResults;

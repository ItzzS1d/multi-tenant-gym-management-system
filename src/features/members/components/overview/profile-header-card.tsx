"use client";

import { formatDistance, format, differenceInDays } from "date-fns";
import { getMemberOverViewDetails } from "../../new/queries";
import { use } from "react";
import { AlertTriangle, Check, Crown, EllipsisVertical, Pencil, Send, FilePlus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { normalizeName } from "@/shared/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { useDialog } from "@/shared/hooks/useDialog";
import EditMemberForm from "../../directory/components/edit-member-form";

const ProfileHeaderCard = ({
    memberOverviewPromise,
}: {
    memberOverviewPromise: ReturnType<typeof getMemberOverViewDetails>;
}) => {
    const { openDialog } = useDialog();
    const overView = use(memberOverviewPromise);

    const user = overView.user;
    const member = overView.memberDetails;
    const activePlan = overView.memberPlans?.[0];
    const lastCheckIn = overView.attendanceEntries?.[0]?.checkInAt;
    const joinedAt = member?.createdAt ? new Date(member.createdAt) : null;
    const daysSinceLastVisit = lastCheckIn
        ? differenceInDays(new Date(), new Date(lastCheckIn))
        : joinedAt
            ? differenceInDays(new Date(), joinedAt)
            : 0;

    const showRetentionWarning = daysSinceLastVisit >= 7;

    const handleEditProfile = () => {
        openDialog({
            title: `Edit Member: ${user.name}`,
            titleDescription: "Update member information and status.",
            size: "large",
            footer: null,
            content: (
                <EditMemberForm
                    memberId={overView.id}
                />
            ),
        });
    };

    const handleScrollToNotes = () => {
        const notesSection = document.getElementById("staff-notes");
        if (notesSection) {
            notesSection.scrollIntoView({ behavior: "smooth", block: "center" });
            // Focus the input if possible
            const input = notesSection.querySelector("input");
            if (input) {
                setTimeout(() => (input as HTMLInputElement).focus(), 800);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 md:p-6 shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex flex-col sm:flex-row md:gap-5 items-center sm:items-start text-center sm:text-left w-full md:w-auto">
                        <div className="relative group cursor-pointer shrink-0">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 border-4 border-[#e7f3eb] dark:border-[#2a4034] shadow-sm"
                                data-alt={`${user.name}'s profile picture`}
                                style={{
                                    backgroundImage: `url("${member?.image ||
                                        "https://ui-avatars.com/api/?name=" +
                                        normalizeName(user.name, "first") +
                                        "+" +
                                        normalizeName(user.name, "last")
                                        }")`,
                                }}
                            ></div>
                            {/*// TODO: Use nextjs image instead of bg image */}
                            {/*<Image />*/}
                            <div className="absolute bottom-0 right-0 md:bottom-1 md:right-1 bg-primary text-text-main-light rounded-full p-1.5 border-2 border-surface-light dark:border-surface-dark">
                                <Check size={14} className="md:w-4 md:h-4" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5 pt-1 w-full">
                            <div className="flex flex-col md:flex-row items-center gap-2 flex-wrap justify-center sm:justify-start">
                                <h1 className="text-xl md:text-3xl font-semibold text-text-main-light dark:text-text-main-dark">
                                    {user.name}
                                </h1>
                                {(() => {
                                    if (!overView?.isActive) {
                                        return <Badge variant="suspended">Inactive</Badge>;
                                    }
                                    if (activePlan?.status === "EXPIRED") {
                                        return <Badge variant="expired">Expired</Badge>;
                                    }
                                    if (activePlan?.status === "ACTIVE") {
                                        return <Badge variant="active">Active Member</Badge>;
                                    }
                                    return <Badge variant="no_plan">No Plan</Badge>;
                                })()}
                            </div>
                            <p className="text-primary text-sm md:text-base font-medium flex items-center gap-1 justify-center sm:justify-start">
                                {activePlan && <Crown size={16} />}
                                {activePlan?.plan?.name || "No Active Plan"}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 font-medium justify-center sm:justify-start">
                                <span className="text-[10px] md:text-xs text-[#4c9a66] dark:text-text-sub-dark bg-[#e7f3eb] px-2 py-1 rounded whitespace-nowrap">
                                    Joined:{" "}
                                    {member?.createdAt
                                        ? format(
                                            new Date(member.createdAt),
                                            "MMM d, yyyy",
                                        )
                                        : "N/A"}
                                </span>
                                <span className="text-[10px] md:text-xs text-[#4c9a66] dark:text-text-sub-dark bg-[#e7f3eb] px-2 py-1 rounded whitespace-nowrap">
                                    Last Visit:{" "}
                                    {lastCheckIn
                                        ? formatDistance(
                                            new Date(lastCheckIn),
                                            new Date(),
                                            { addSuffix: true },
                                        )
                                        : "Never"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto  md:mt-0">
                        <Button
                            onClick={handleEditProfile}
                            className="flex-1 md:flex-none h-10 px-4 bg-[#e7f3eb] dark:bg-[#2a4034] hover:bg-[#d5e8db] dark:hover:bg-[#354f40] text-text-main-light dark:text-text-main-dark rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Pencil size={18} />
                            <span className="whitespace-nowrap">Edit Profile</span>
                        </Button>
                        <Button
                            onClick={handleScrollToNotes}
                            className="flex-1   px-4 bg-primary hover:bg-[#0fd650] text-[#000000] rounded-lg text-sm font-bold transition-colors shadow-sm shadow-primary/30 flex items-center justify-center gap-2"
                        >
                            <FilePlus size={18} />
                            <span className="whitespace-nowrap">Log Note</span>
                        </Button>

                    </div>
                </div>
            </section>

            {showRetentionWarning && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-4 text-center md:text-left">
                        <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                            <AlertTriangle className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-amber-900 dark:text-amber-100 font-bold text-base leading-tight">
                                Retention Warning
                            </h3>
                            <p className="text-amber-800 font-medium dark:text-amber-200/80 text-sm mt-0.5">
                                {normalizeName(user.name, "first")} hasn&apos;t visited in{" "}
                                {daysSinceLastVisit} days. Consider reaching out to keep{" "}
                                {normalizeName(user.name, "first")} motivated!
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ProfileHeaderCard;
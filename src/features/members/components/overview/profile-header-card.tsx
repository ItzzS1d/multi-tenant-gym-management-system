import { formatDistance, format } from "date-fns";
import { getMemberOverViewDetails } from "../../new/queries";
import { use } from "react";
import { Check, Crown, EllipsisVertical, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { normalizeName } from "@/shared/lib/utils";

const ProfileHeaderCard = ({
    memberOverviewPromise,
}: {
    memberOverviewPromise: ReturnType<typeof getMemberOverViewDetails>;
}) => {
    const overView = use(memberOverviewPromise);
    const user = overView.user;
    const member = overView.memberDetails;
    const activePlan = overView.memberPlans?.[0];
    const lastCheckIn = overView.attendanceEntries?.[0]?.checkInAt;

    return (
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 md:p-6 shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-center justify-between">
                <div className="flex flex-col sm:flex-row md:gap-5 items-center sm:items-start text-center sm:text-left w-full md:w-auto">
                    <div className="relative group cursor-pointer shrink-0">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 border-4 border-[#e7f3eb] dark:border-[#2a4034] shadow-sm"
                            data-alt={`${user.name}'s profile picture`}
                            style={{
                                backgroundImage: `url("${
                                    member?.image ||
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
                            <span
                                className={`px-2.5 py-0.5 rounded-full ${
                                    overView?.isActive
                                        ? "bg-primary/20 text-emerald-900 dark:text-primary border-primary/20"
                                        : "bg-red-100 text-red-800 border-red-200"
                                }  text-[10px] md:text-xs font-bold uppercase tracking-wide border `}
                            >
                                {overView?.isActive
                                    ? "Active Member"
                                    : "Inactive"}
                            </span>
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
                    <Button className="flex-1 md:flex-none h-10 px-4 bg-[#e7f3eb] dark:bg-[#2a4034] hover:bg-[#d5e8db] dark:hover:bg-[#354f40] text-text-main-light dark:text-text-main-dark rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Pencil size={18} />
                        <span className="whitespace-nowrap">Edit Profile</span>
                    </Button>
                    <button className="flex-1 md:flex-none h-10 px-4 bg-primary hover:bg-[#0fd650] text-[#000000] rounded-lg text-sm font-bold transition-colors shadow-sm shadow-primary/30 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                            note_add
                        </span>
                        <span className="whitespace-nowrap">Log Note</span>
                    </button>
                    <Button
                        variant="ghost"
                        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg border border-[#e7f3eb] dark:border-[#2a4034] text-text-sub-light hover:bg-[#e7f3eb] dark:hover:bg-[#2a4034] transition-colors"
                    >
                        <span className="material-symbols-outlined">
                            <EllipsisVertical />
                        </span>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ProfileHeaderCard;

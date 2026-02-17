import { Badge, BadgeCheck, CreditCard, PlusCircle } from "lucide-react";

export default function EmptyMembershipState({ onAssignPlan }) {
    return (
        <div className="bg-white dark:bg-[#1c2e24] p-5 rounded-xl shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
            {/* Header */}
            <h3 className="text-lg font-bold text-[#0d1b12] dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="text-emerald-400" size={20} />
                Membership Details
            </h3>

            {/* Empty state body */}
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <BadgeCheck
                        size={40}
                        className="text-gray-300 dark:text-gray-600"
                    />
                </div>

                <h4 className="text-sm font-bold text-[#0d1b12] dark:text-white mb-1">
                    No Active Plan
                </h4>

                <p className="text-[11px] leading-relaxed text-[#4c9a66] dark:text-[#a0cbb0] px-2 mb-4">
                    This member does not have an active membership plan
                    assigned. Click below to add one.
                </p>

                <button
                    onClick={onAssignPlan}
                    className="w-full px-4 py-2 bg-[#8CF5B2] text-emerald-900 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-95 transition-all"
                >
                    <PlusCircle size={16} />
                    Assign Plan
                </button>
            </div>
        </div>
    );
}

'use client'

import { use } from "react";
import {
    Building2,
    Zap,
    Megaphone,
    RefreshCcw
} from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/shared/lib/utils";
import { getUpcomingRecurringExpenses } from "../expenses-queries";

const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('rent') || t.includes('property')) return <Building2 size={16} />;
    if (t.includes('energy') || t.includes('utility') || t.includes('bolt')) return <Zap size={16} />;
    if (t.includes('ads') || t.includes('marketing') || t.includes('campaign')) return <Megaphone size={16} />;
    return <RefreshCcw size={16} />;
};

const UpcomingBills = ({
    upcomingExpensesPromise
}: {
    upcomingExpensesPromise: ReturnType<typeof getUpcomingRecurringExpenses>;
}) => {
    const data = use(upcomingExpensesPromise);

    if (!data) return null;

    return (
        <div className=" p-6 rounded-xl border border-[#86efac]/10 shadow-sm ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white font-lexend text-lg">Upcoming Bills</h3>
                    <p className="text-xs text-slate-400">Next 30 Days</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500">Total Due</p>
                    <p className="text-xl font-bold text-[#ef4444]">
                        {formatCurrency(data.totalUpcomingAmount)}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {data.upcomingExpenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {/* Icon Container matched to HTML layout */}
                            <div className="w-8 h-8 rounded bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                <span className="text-slate-400">
                                    {getIcon(expense.title)}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {expense.title}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                                    {expense.vendorName || 'Vendor'} • {expense.nextDueDate ? format(expense.nextDueDate, "MMM dd") : 'TBD'}
                                </p>
                            </div>
                        </div>

                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {formatCurrency(expense.amount)}
                        </span>
                    </div>
                ))}

                {data.upcomingExpenses.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-6 border-2 border-dashed border-slate-50 rounded-lg">
                        No upcoming bills
                    </p>
                )}
            </div>
        </div>
    );
};

export default UpcomingBills;
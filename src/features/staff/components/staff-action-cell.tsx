import { Button } from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useDialog } from "@/shared/hooks/useDialog";
import { Ellipsis, ReceiptText, Trash, TriangleAlert } from "lucide-react";
import { StaffTableColumnProps } from "./staff-table-columns";
import { capitalize, normalizeName } from "@/shared/lib/utils";
import { useActionHandler } from "@/shared/hooks/useActionhandler";
import { disableStaffAccount } from "../staff-actions";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState } from "react";

const StaffActionCell = ({ data }: { data: StaffTableColumnProps }) => {
    const { openDialog, closeDialog } = useDialog();
    const { handleAction, loading } = useActionHandler();
    const [disableReason, setDisableReason] = useState("");

    const handleConfimmDisable = async (userId: string) => {
        await handleAction(
            disableStaffAccount,
            {
                disabledReason: disableReason,
                id: userId,
            },
            {
                onSuccess() {
                    closeDialog();
                    setDisableReason("");
                },
            },
        );
    };
    const handleDisableAccount = () => {
        openDialog({
            type: "confirmation",
            title: "Disable Account",
            titleDescription:
                "Are you sure you want to disable this account? The user will not be able to access their account until it is re-enabled.",
            titleIcon: <TriangleAlert />,
            content: (
                <div className="flex flex-col gap-4 w-full mt-4">
                    <div className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                <ReceiptText className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Staff Member
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                                    {normalizeName(data.name, "full")}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                ROLE
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
                                {capitalize(data.role)}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Reason for disabling
                        </label>
                        <Textarea
                            placeholder="Please provide a reason for disabling this account..."
                            value={disableReason}
                            onChange={(e) => setDisableReason(e.target.value)}
                            className="resize-none min-h-[100px]"
                        />
                    </div>
                </div>
            ),
            footer: (
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="outline" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleConfimmDisable(data.userId)}
                        disabled={loading || disableReason.trim() === ""}
                    >
                        Disable Account
                    </Button>
                </div>
            ),
        });
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button variant="ghost">
                        <Ellipsis />
                    </Button>
                }
            />
            <DropdownMenuContent className="whitespace-nowrap w-50">
                <DropdownMenuItem
                    className="justify-between"
                    variant="destructive"
                    onClick={handleDisableAccount}
                >
                    Disable Account
                    <Trash />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default StaffActionCell;

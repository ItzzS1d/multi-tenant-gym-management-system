import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SendHorizonal, StickyNote } from "lucide-react";

export default function StaffNotesContentSkeleton() {
    return (
        <section className="bg-surface-light lg:col-span-3  dark:bg-surface-dark rounded-xl p-5 shadow-lg border border-[#e7f3eb] dark:border-[#2a4034]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-text-main-light dark:text-text-main-dark flex items-center gap-2">
                    <span className="text-primary">
                        <StickyNote />
                    </span>
                    Staff Notes
                </h3>
                <Skeleton className="h-3 w-3" />
            </div>
            {/*loadder*/}

            <div className="space-y-2 max-h-50 overflow-y-scroll pb-3">
                <div className="bg-[#f8fcf9] dark:bg-[#102216] p-3 rounded-lg border border-[#e7f3eb] dark:border-[#2a4034]">
                    <div className="flex justify-between items-center mb-1">
                        <Skeleton className="w-10 h-7" />

                        <Skeleton className="w-8 h-8" />
                    </div>
                    <Skeleton className="w-96 h-13" />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <Input
                    className="w-full h-11 bg-[#f8fcf9] dark:bg-[#102216] border border-[#e7f3eb] dark:border-[#2a4034]  text-sm  focus:border-primary "
                    placeholder="Add a new note..."
                    type="text"
                    disabled
                />
                <Button disabled>
                    <SendHorizonal size={20} />
                </Button>
            </div>
        </section>
    );
}

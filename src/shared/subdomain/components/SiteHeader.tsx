import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import Titlebar from "./bread-crumb";
import DropDownMenuContent from "./drop-down-menu";
import { currentMember } from "@/shared/lib/session";
import ClockInOut from "./clock-in-out";
import { getCheckInCheckOutStatus } from "@/features/attendance/attendance-queries";

export default async function SiteHeader() {
    const res = await currentMember();
    if (!res) return null;
    const attendanceStatus = getCheckInCheckOutStatus();

    return (
        <header className="flex h-(--header-height)  shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-50 mb-2">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-6"
                />
                <Titlebar />
                <div className="ml-auto flex items-center gap-6">
                    {res?.role === "admin" ||
                        (res?.role === "trainer" && (
                            <ClockInOut
                                attendanceStatusPromise={attendanceStatus}
                            />
                        ))}
                    <DropDownMenuContent
                        image={res.user.image}
                        email={res.user.email}
                        name={res.user.name}
                    />
                </div>
            </div>
        </header>
    );
}

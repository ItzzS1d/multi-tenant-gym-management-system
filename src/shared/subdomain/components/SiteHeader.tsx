import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/shared/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/shared/components/ui/dropdown-menu";
// import { KbdGroup, Kbd } from "../ui/kbd";
import Logout from "./Logout";
import Titlebar from "./bread-crumb";

export default async function SiteHeader() {
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
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="mr-4">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            sideOffset={10}
                            className="mr-10 w-55 "
                        >
                            <DropdownMenuLabel className="text-md">
                                Account
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup className="space-y-1.5">
                                <DropdownMenuSeparator />
                                <Logout />
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

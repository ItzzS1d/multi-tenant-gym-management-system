"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { LogOut } from "lucide-react";
import { authClient } from "@/shared/config/authClient.config";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/shared/components/ui/spinner";

const DropDownMenu = ({ image }: { image?: string | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onRequest: () => setIsLoading(true),
                onError() {
                    toast.error("Failed to logout");
                },
                onResponse() {
                    setIsLoading(false);
                    toast.success("Logged out successfully");
                },
            },
        });
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage
                        src={image ? image : "/default-user.png"}
                        alt="Avatar"
                    />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10}>
                <DropdownMenuItem
                    closeOnClick={!isLoading}
                    className="flex gap-4 justify-between"
                    variant="destructive"
                    onClick={handleLogout}
                >
                    Logout
                    {isLoading ? <Spinner /> : <LogOut aria-hidden />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropDownMenu;

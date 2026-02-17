"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/shared/config/authClient.config";
import { toast } from "sonner";
import { useState } from "react";
import { DropdownMenuItem } from "@/shared/components/ui/dropdown-menu";
import { Spinner } from "@/shared/components/ui/spinner";

const Logout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleLogout() {
        setIsLoading(true);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    setIsLoading(false);
                    toast.success("Signed out successfully");
                    router.replace("/login");
                },
                onError: () => {
                    setIsLoading(false);
                    toast.error("Failed to sign out please try again");
                },
            },
        });
    }
    return (
        <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2 justify-between"
        >
            <span>Sign Out</span>
            {isLoading ? <Spinner /> : <LogOut />}
        </DropdownMenuItem>
    );
};

export default Logout;

"use client";
import { LogOut, UserCircle, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/shared/config/authClient.config";
import { toast } from "sonner";
import { use, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Spinner } from "@/shared/components/ui/spinner";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/shared/components/ui/avatar";
import { currentUser } from "@/shared/lib/session";
import { useTopLoader } from "nextjs-toploader";
import { getInitials } from "@/shared/lib/utils";

const DropDownMenuContent = ({
    image,
    name,
    email,
}: {
    image: Awaited<ReturnType<typeof currentUser>>["user"]["image"];
    name: Awaited<ReturnType<typeof currentUser>>["user"]["name"];
    email: Awaited<ReturnType<typeof currentUser>>["user"]["email"];
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const loader = useTopLoader();

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
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="">
                        <AvatarImage src={image ?? "/default-user.png"} />
                        <AvatarFallback>{image}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="  w-full px-4 ">
                    <div className="flex items-center gap-5 mb-3">
                        <div>
                            <h1>{name}</h1>
                            <p className="text-xs text-gray-500 font-medium">
                                {email}
                            </p>
                        </div>
                        <Avatar>
                            {image ? (
                                <AvatarImage src={image} />
                            ) : (
                                <AvatarFallback>
                                    {getInitials(name)}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => {
                            loader.start();
                            router.push("/profile");
                        }}
                    >
                        <UserCircle size={20} />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            loader.start();
                            router.push("/profile");
                        }}
                    >
                        <UserCircle size={20} />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            loader.start();
                            router.push("/profile");
                        }}
                    >
                        <UserCircle size={20} />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleLogout}
                        closeOnClick={false}
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner /> : <LogOut />}
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                    <DropdownMenuGroup className="space-y-1.5">
                        <DropdownMenuLabel>My account</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                loader.start();
                                router.push("/profile");
                            }}
                        >
                            <UserIcon />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </DropdownMenuGroup>
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleLogout}
                        closeOnClick={false}
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner /> : <LogOut />}
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>{" "}
        </>
    );
};

export default DropDownMenuContent;

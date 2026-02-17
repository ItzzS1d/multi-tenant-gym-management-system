import { Dumbbell } from "lucide-react";
import DropDownMenu from "./drop-down";
import { currentUser } from "@/shared/lib/session";
import Link from "next/link";

const Header = async () => {
    const res = await currentUser();
    return (
        <header className="flex items-center justify-between p-2 px-6 border-b shadow-lg sticky inset-0">
            <Link href="/" className="flex items-center gap-2">
                <div className="flex items-center justify-center size-8   rounded-full text-accent bg-primary dark:text-primary">
                    <Dumbbell className="text-[24px]" aria-hidden />
                </div>
                <h1 className="text-text-main dark:text-white text-xl font-bold tracking-tight">
                    Gym Mart
                </h1>
            </Link>
            <div className="flex items-center">
                {!res ? (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/register"
                            className="bg-primary border p-1 px-4 rounded font-medium text-accent border-primary  "
                        >
                            Get Started
                        </Link>
                        <Link
                            href="/login"
                            className="hover:bg-primary border-2 p-1 px-5 rounded border-primary  hover:text-accent transition-colors duration-150"
                        >
                            Sign In
                        </Link>
                    </div>
                ) : (
                    <DropDownMenu image={res.user.image} />
                )}
            </div>
        </header>
    );
};

export default Header;

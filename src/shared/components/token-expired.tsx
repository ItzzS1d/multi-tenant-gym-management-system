import { Link2Off } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const InvalidLinkPage = () => {
    return (
        <main className="flex-1 flex items-center justify-center p-6 h-svh">
            <div className="layout-content-container flex flex-col max-w-[480px] w-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 p-8 md:p-12">
                <div className="flex flex-col items-center gap-8">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary/5 rounded-full scale-150 blur-xl"></div>
                        <div className="relative w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-6xl">
                                <Link2Off size={40} />
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight tracking-tight text-center">
                            Link Invalid or Expired
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-relaxed text-center max-w-[380px]">
                            The email verification link you clicked is either
                            invalid or has expired for your security. Please
                            request a new verification link to proceed with your
                            Gym Mart setup.
                        </p>
                    </div>
                    <div className="w-full flex flex-col items-center gap-4">
                        <Button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-accent text-base font-bold leading-normal transition-all shadow-lg shadow-primary/20">
                            <span className="truncate">Request New Link</span>
                        </Button>
                        <Link
                            className="text-muted-foreground hover:text-primary  text-sm font-medium transition-colors"
                            href="/login"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default InvalidLinkPage;

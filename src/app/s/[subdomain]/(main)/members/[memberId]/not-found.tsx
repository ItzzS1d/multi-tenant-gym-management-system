import { Search } from "lucide-react";

const NotFound = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-svh bg-gradient-to-b from-surface-light to-white dark:from-surface-dark dark:to-[#0a1410] px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Animated Icon Container */}
                <div className="relative inline-block">
                    <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#e7f3eb] to-[#d5e8db] dark:from-[#1c2e24] dark:to-[#102216] rounded-full flex items-center justify-center relative overflow-hidden shadow-2xl border-4 border-white dark:border-[#2a4034]">
                        {/* Main Icon */}
                        <div className="relative z-10">
                            <Search
                                className="w-32 h-32 text-text-sub-light dark:text-text-sub-dark opacity-40"
                                strokeWidth={1.5}
                            />
                        </div>

                        {/* Animated Ripples */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 rounded-full border-2 border-primary/20 animate-ping" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-56 h-56 rounded-full border-2 border-primary/10 animate-pulse" />
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-pulse delay-75" />
                    <div className="absolute top-1/2 -right-12 w-12 h-12 bg-primary/15 rounded-full blur-lg animate-bounce" />
                </div>

                {/* Content */}
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-6xl font-bold text-text-main-light dark:text-text-main-dark bg-gradient-to-r from-text-main-light to-text-sub-light dark:from-text-main-dark dark:to-text-sub-dark bg-clip-text text-transparent">
                            404
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-semibold text-text-main-light dark:text-text-main-dark">
                            Member Not Found
                        </h2>
                    </div>

                    <p className="text-lg text-text-sub-light dark:text-text-sub-dark max-w-lg mx-auto leading-relaxed">
                        Looks like this member skipped leg day... and every
                        other day too. The ID you're looking for doesn't exist
                        in our system.
                    </p>
                </div>
            </div>
        </main>
    );
};

export default NotFound;

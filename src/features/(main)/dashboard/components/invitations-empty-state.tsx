"use client";
import { Button } from "@/shared/components/ui/button";
import { Building2, Dumbbell, RefreshCw, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const InvitationEmptyState = () => {
    const router = useRouter();
    return (
        <main className="grow w-full max-w-6xl mx-auto  px-4 sm:px-6 lg:px-8 py-10 space-y-40">
            <section className="flex flex-col items-center justify-center py-16  rounded-lg border border-slate-200 ">
                <div className="relative w-32 h-32 mb-6 flex items-center justify-center bg-primary text-accent rounded-full">
                    <Dumbbell size={60} className="text-gym-green-primary" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    No active gyms found
                </h2>

                <p className="text-slate-500 text-center max-w-md leading-relaxed">
                    You're just one step away from launching your fitness
                    business. Create your first gym location to get started.
                </p>

                <p className="mt-4 text-sm text-gray-400 hover:text-gym-green-dark transition-colors">
                    Waiting for an invite?{" "}
                    <a href="https://mail.google.com" target="_blank">
                        Check your email
                    </a>
                    &nbsp; or
                    <Button
                        variant="ghost"
                        className="text-primary"
                        onClick={router.refresh}
                    >
                        Refresh to check any pending invites
                    </Button>
                </p>
            </section>

            <section>
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gym-green-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gym-green-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl md:text-3xl font-medium  mb-3">
                                Ready to launch your gym?
                            </h2>

                            <p className="text-gray-500 font-medium ">
                                Create a new gym instance in seconds. Get full
                                access to membership management, automated
                                billing, and staff scheduling tools.
                            </p>
                        </div>

                        <div className="w-full md:w-auto shrink-0">
                            <Button
                                className="w-full md:w-auto    p-5  flex items-center justify-center gap-2 text-accent "
                                onClick={() => router.push("/onboarding")}
                            >
                                <Building2 size={28} />
                                <span>Create New Gym</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default InvitationEmptyState;

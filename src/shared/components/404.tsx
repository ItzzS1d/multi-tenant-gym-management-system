import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "../main/components/header";
import { Route } from "next";

type NotFoundProps =
    | {
          mode: "default";
      }
    | {
          mode: "tenant";
          url: string;
          logo?: string | null;
      };
const NotFound = (props: NotFoundProps) => {
    const { mode } = props;

    return (
        <>
            {mode === "default" && <Header />}
            <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex w-full max-w-md flex-col items-center text-center sm:max-w-lg md:max-w-2xl">
                    <div className="relative mb-8 aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl bg-background-light p-8 shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10 sm:max-w-[340px] md:max-w-[440px]">
                        {mode === "tenant" && props.logo ? (
                            <Image
                                src={props.logo}
                                alt="Not Found"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Image
                                src="/404-bg.png"
                                alt="Not Found"
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <h1 className="mb-3 text-3xl font-black leading-tight tracking-tight text-[#0d1c17] dark:text-white sm:text-4xl md:text-5xl">
                        Looks like this page{" "}
                        <span className="text-primary">skipped leg day!</span>
                    </h1>
                    <p className="mb-8 max-w-[500px] text-base font-normal leading-relaxed text-[#4f635d] dark:text-[#a0b3ad] sm:text-lg">
                        Oops! The page you are looking for has been moved,
                        deleted, or never showed up for its workout. Let&apos;s
                        get you back on track.
                    </p>
                    {mode === "default" ? (
                        <Link
                            href="/"
                            replace
                            className="flex h-12 w-full min-w-[200px] text-accent cursor-pointer group items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-[#0d1c17] transition-all hover:brightness-95 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/30 sm:w-auto"
                        >
                            <ArrowLeft className="mr-2 text-[20px] group-hover:-translate-x-3 transition-transform duration-300" />
                            Go to Homepage
                        </Link>
                    ) : (
                        <Link
                            href={props.url as Route}
                            replace
                            className="flex h-12 w-full min-w-[200px] text-accent cursor-pointer group items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-[#0d1c17] transition-all hover:brightness-95 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/30 sm:w-auto"
                        >
                            <LayoutDashboard className="mr-2 text-[20px] group-hover:rotate-180 transition-transform duration-500" />
                            Return to Dashboard
                        </Link>
                    )}
                    {mode === "default" || (
                        <Link
                            className="group flex items-center gap-1 text-base font-medium text-primary hover:text-green-600 transition-colors mt-6"
                            href="/"
                            replace
                        >
                            <ArrowLeft className="text-[20px] transition-transform group-hover:-translate-x-1" />
                            Go to Homepage
                        </Link>
                    )}
                </div>
            </main>
        </>
    );
};

export default NotFound;

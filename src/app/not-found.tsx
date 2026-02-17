import NotFound from "@/shared/components/404";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 - Page Not Found",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFoundPage() {
    return <NotFound mode="default" />;
}

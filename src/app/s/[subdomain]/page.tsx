import { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
    const { subdomain } = await params;
    const gymName = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

    return {
        title: gymName,
        description: `Welcome to ${gymName}.`,
    };
}

export default async function SubdomainPage({
    params,
}: PageProps<"/s/[subdomain]">) {
    const { subdomain } = await params;

    return <div>{subdomain}</div>;
}

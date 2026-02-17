export default async function SubdomainPage({
    params,
}: PageProps<"/s/[subdomain]">) {
    const { subdomain } = await params;

    return <div>{subdomain}</div>;
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.BETTER_AUTH_URL!;

    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/login", "/register"],
            disallow: ["/onboarding", "/verify"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

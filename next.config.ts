import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    typedRoutes: true,
    experimental: {
        typedEnv: true,
        turbopackUseSystemTlsCerts: true,
    },
    logging: {
        fetches: {
            hmrRefreshes: true,
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    productionBrowserSourceMaps: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

export default nextConfig;

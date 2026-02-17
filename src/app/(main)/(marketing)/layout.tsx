import Header from "@/shared/main/components/header";
import React from "react";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            {children}
        </>
    );
};

export default MarketingLayout;

"use client";
import { Button } from "@/shared/components/ui/button";
import React, { useEffect } from "react";

const Error = ({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (
        <>
            <Button onClick={reset}>Try Again</Button>
        </>
    );
};

export default Error;

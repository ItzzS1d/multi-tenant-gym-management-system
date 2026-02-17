"use client";

import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const AnimatedCheckIcon = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="mx-auto mb-8 relative flex items-center justify-center">
            <div
                className={`absolute inset-0 bg-primary/20 rounded-full blur-xl transition-opacity duration-700 ${isVisible ? "opacity-100 animate-pulse" : "opacity-0"
                    }`}
            ></div>
            <div
                className={`relative size-24 bg-gradient-to-br from-primary/10 to-primary/30 rounded-full flex items-center justify-center ring-4 ring-primary/10 transition-all duration-700 ${isVisible
                        ? "scale-100 rotate-0 opacity-100"
                        : "scale-0 rotate-180 opacity-0"
                    }`}
            >
                <CheckCircle
                    className={`text-primary text-[48px] transition-all duration-500 delay-300 ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                    size={48}
                    strokeWidth={2.5}
                />
            </div>
        </div>
    );
};

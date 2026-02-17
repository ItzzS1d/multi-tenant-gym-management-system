"server-only";
import { cookies } from "next/headers";
import { FlashToastProps } from "./flash-toast";

export async function setCookie({ message, type }: FlashToastProps) {
    (await cookies()).set(
        "flash",
        JSON.stringify({
            type,
            message,
        }),
        {
            path: "/",
            sameSite: "lax",
            httpOnly: false,
            secure: process.env.NODE_ENV != "development",
            maxAge: 60,
        },
    );
}

export async function getFlash(): Promise<FlashToastProps | null> {
    const raw = (await cookies()).get("flash")?.value;
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

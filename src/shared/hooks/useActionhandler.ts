"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { useDialog } from "./useDialog";
import { ActionResponse } from "../lib/action-response";
import { useState } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type HandleActionOptions<TData> = {
    onSuccess?: (data?: TData) => void;
    onError?: (message: string) => void;
    successMessage?: string;
    showNotification?: boolean;
};

export function useActionHandler() {
    const router = useRouter();
    // const { updateDialog } = useDialog();
    const [loading, setLoading] = useState(false);

    const handleAction = async <TData, TVariables>(
        action: (payload: TVariables) => Promise<ActionResponse<TData>>,
        payload: TVariables,
        options?: HandleActionOptions<TData>,
    ) => {
        try {
            // updateDialog({ loading: true });
            setLoading(true);

            const result = await action(payload);

            if (result.type === "ERROR") {
                const isLoginPage = location.pathname.startsWith("/login");

                if (result.statusCode === 401 && !isLoginPage) {
                    router.push(
                        `/login?redirectTo=${encodeURIComponent(location.pathname)}`,
                    );
                }

                options?.onError?.(result.message);

                if (result.showNotification !== false) {
                    toast.error(result.message);
                }

                return result;
            }

            options?.onSuccess?.(result.data);

            if (result.showNotification !== false) {
                const message = options?.successMessage || result.message;
                toast.success(message);
            }
        } catch (error) {
            if (isRedirectError(error)) {
                if (
                    error.message === "NEXT_REDIRECT" ||
                    error?.digest?.startsWith("NEXT_REDIRECT")
                ) {
                    throw error;
                }
            }
            console.error("Unexpected error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            // updateDialog({ loading: false });
            setLoading(false);
        }
    };

    return { handleAction, router, loading, setLoading };
}

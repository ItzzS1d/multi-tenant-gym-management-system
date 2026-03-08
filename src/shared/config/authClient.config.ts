import {
    inferAdditionalFields,
    organizationClient,
} from "better-auth/client/plugins";

import { createAuthClient } from "better-auth/react";
import {
    ac,
    admin,
    god,
    owner,
    trainer,
} from "@/shared/constants/better-auth-roles";
import { auth } from "./auth.config";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
        organizationClient({
            ac,
            roles: {
                admin,
                owner,
                god,
                trainer,
            },
        }),
    ],
    fetchOptions: {
        credentials: "include",
    },
});

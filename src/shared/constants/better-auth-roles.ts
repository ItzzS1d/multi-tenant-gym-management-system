import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/organization/access";

const statement = {
    ...defaultStatements,
    member: ["create", "update", "delete", "read"],
    staff: ["create", "update", "delete", "read"],
    plan: ["create", "update", "delete", "read"],
    expense: ["create", "update", "delete", "read"],
    attendance: ["create", "update", "delete", "read"],
    notes: ["create", "update", "delete", "read"],
    invitation: ["cancel", "create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
    organization: ["update", "delete"],
    member: ["create", "update", "delete", "read"],
    staff: ["create", "update", "delete", "read"],
    plan: ["create", "update", "delete", "read"],
    expense: ["create", "update", "delete", "read"],
    attendance: ["create", "update", "delete", "read"],
    invitation: ["cancel", "create", "read", "update", "delete"],
    notes: ["create", "update", "delete", "read"],
});

export const admin = ac.newRole({
    member: ["create", "update", "delete", "read"],
    staff: ["create", "update", "delete", "read"],
    plan: ["create", "update", "read"],
    expense: ["create", "update", "read"],
    attendance: ["create", "update", "delete", "read"],
    invitation: ["cancel", "create", "read", "update", "delete"],
    notes: ["create", "update", "delete", "read"],
});

export const trainer = ac.newRole({
    member: ["create", "update", "read"],
    staff: [],
    plan: ["read"],
    expense: [],
    attendance: ["create", "update", "delete", "read"],
    notes: ["create", "update", "delete", "read"],
    invitation: [],
});

export const member = ac.newRole({
    plan: [],
});

export const god = ac.newRole({
    member: ["create", "update", "delete", "read"],
    staff: ["create", "update", "delete"],
    plan: ["create", "update", "delete"],
    expense: ["create", "update", "delete"],
    attendance: ["create", "update", "delete", "read"],
    notes: ["create", "update", "delete", "read"],
});

export type Resources = keyof typeof statement;
export type Actions = (typeof statement)[Resources][number];

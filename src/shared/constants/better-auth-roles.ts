import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/organization/access";

const statement = {
    ...defaultStatements,
    member: ["create", "update", "delete", "read"], // Added read to member
    staff: ["create", "update", "delete", "read"],
    plan: ["create", "update", "delete", "read"], // Added plans
    expense: ["create", "update", "delete", "read"], // Added expenses
    attendance: ["create", "update", "delete", "read"],
    notes: ["create", "update", "delete", "read"],
    invitation: ["cancel", "create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
    organization: ["update", "delete"],
    member: ["create", "update", "delete", "read"],
    staff: ["create", "update", "delete", "read"],
    plan: ["create", "update", "delete", "read"], // Owner can manage plans
    expense: ["create", "update", "delete", "read"], // Owner can manage expenses
    attendance: ["create", "update", "delete", "read"], // Owner can manage attendance
    invitation: ["cancel", "create", "read", "update", "delete"],
    notes: ["create", "update", "delete", "read"],
});

export const admin = ac.newRole({
    member: ["create", "update", "delete", "read"],
    staff: ["create", "update", "delete", "read"],
    plan: ["create", "update", "read"], // Admin can create/update plans
    expense: ["create", "update", "read"], // Admin can manage expenses
    attendance: ["create", "update", "delete", "read"], // Admin can manage attendance
    invitation: ["cancel", "create", "read", "update", "delete"],
    notes: ["create", "update", "delete", "read"],
});

export const trainer = ac.newRole({
    member: ["create", "update", "read"],
    staff: [],
    plan: [], // Trainers cannot manage plans
    expense: [], // Trainers cannot manage expenses
    attendance: ["create", "update", "delete", "read"], // Trainers can manage attendance
    notes: ["create", "update", "delete", "read"],
    invitation: [],
});

export const member = ac.newRole({
    plan: [], // cannot manage plans
});

export const god = ac.newRole({
    member: ["create", "update", "delete", "read"],
    staff: ["create", "update", "delete"],
    plan: ["create", "update", "delete"], // God can do everything
    expense: ["create", "update", "delete"], // God can manage expenses
    attendance: ["create", "update", "delete", "read"], // God can manage attendance
    notes: ["create", "update", "delete", "read"],
});

export type Resources = keyof typeof statement;
export type Actions = (typeof statement)[Resources][number];

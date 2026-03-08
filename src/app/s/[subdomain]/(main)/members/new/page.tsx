import NewMemberForm from "@/features/members/components/form/member-form";
import { getPlansList } from "@/features/members/new/queries";
import { getTrainersList } from "@/features/staff/staff-queries";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "New Member",
    description: "Register a new member to your gym.",
};

const NewMember = async () => {
    const plansListPromise = getPlansList();
    const trainersListPromise = getTrainersList();

    return (
        <NewMemberForm
            plansListPromise={plansListPromise}
            trainersListPromise={trainersListPromise}
        />
    );
};

export default NewMember;

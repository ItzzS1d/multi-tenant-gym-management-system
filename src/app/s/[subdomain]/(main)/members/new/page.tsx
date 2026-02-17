import NewMemberForm from "@/features/members/components/form/member-form";
import { getPlansList, getTrainersList } from "@/features/members/new/queries";

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

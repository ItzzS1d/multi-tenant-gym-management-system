import { use } from "react";
import { getUserJoinedGymList } from "../queries";
import JoinedGymListCard from "./joined-gym-list-card";

interface JoinedGymsListProps {
    listPromise: ReturnType<typeof getUserJoinedGymList>;
}

const JoinedGymsList = ({ listPromise }: JoinedGymsListProps) => {
    const joinedList = use(listPromise);
    return (
        <div>
            <h1>Your Active Gyms.</h1>
            {joinedList.map((list) => (
                <JoinedGymListCard data={list} key={list.id} />
            ))}
        </div>
    );
};

export default JoinedGymsList;

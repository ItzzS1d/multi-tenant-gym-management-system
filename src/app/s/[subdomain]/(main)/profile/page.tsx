import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Suspense } from "react";

const Profile = () => {
    return (
        <main>
            <Tabs>
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="attendance">
                        Attendance & Earnings
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <Suspense></Suspense>
                </TabsContent>
                <TabsContent value="attendace">w</TabsContent>
            </Tabs>
        </main>
    );
};

export default Profile;

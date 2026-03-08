import ProfileHeaderCardSkeleton from "@/features/members/components/overview/skeletons/profile-header-card-skeleton";
import {
    getMemberNotes,
    getMemberOverViewDetails,
} from "@/features/members/new/queries";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import prisma from "@/shared/config/prisma.config";
import { CalendarDays, ReceiptText, SquareChartGantt } from "lucide-react";
import { Suspense } from "react";
import ProfileHeaderCard from "@/features/members/components/overview/profile-header-card";
import OverViewTab from "@/features/members/components/overview/overview-tab";
import AttendanceTab from "@/features/members/components/attendance/attendace-tab";
import BillingTab from "@/features/members/components/billing/billing-tab";
import { notFound } from "next/navigation";
import { Metadata } from "next";
const tabs = [
    {
        label: "Overview",
        value: "overView",
        icon: SquareChartGantt,
    },
    {
        label: "Attendance",
        value: "attendance",
        icon: CalendarDays,
    },
    {
        label: "Billing",
        value: "billing",
        icon: ReceiptText,
    },
] as const;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ memberId: string }>;
}): Promise<Metadata> {
    const { memberId } = await params;
    const member = await prisma.gymMember.findUnique({
        where: { id: memberId },
        select: { user: { select: { name: true } } },
    });

    return {
        title: member?.user?.name || "Member Details",
        description: `View profile and manage details for ${member?.user?.name || "this member"}.`,
    };
}

const MemberPage = async ({
    params,
}: Readonly<PageProps<"/s/[subdomain]/members/[memberId]">>) => {
    const { memberId } = await params;
    const member = await prisma.gymMember.findUnique({
        where: { id: memberId },
        select: { id: true, user: { select: { name: true } } },
    });
    if (!member) {
        notFound();
    }

    const memberOverviewPromise = getMemberOverViewDetails(memberId);
    const memberNotesPromise = getMemberNotes(memberId);

    return (
        <main>
            <Suspense fallback={<ProfileHeaderCardSkeleton />}>
                <ProfileHeaderCard
                    memberOverviewPromise={memberOverviewPromise}
                />
            </Suspense>
            <Tabs defaultValue="overview" className="my-5">
                <TabsList variant="line" className="underline-offset-8">
                    {tabs.map((tab, i) => (
                        <TabsTrigger
                            className="text-primary text-md data-active:text-black data-active:after:bg-green-500"
                            value={tab.value}
                            key={i}
                        >
                            <tab.icon className="text-primary" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="overView">
                    <OverViewTab
                        memberNotesPromise={memberNotesPromise}
                        memberOverviewPromise={memberOverviewPromise}
                        memberId={member.id}
                        memberName={member.user.name}
                    />
                </TabsContent>
                <TabsContent value="attendance">
                    <Suspense>
                        <AttendanceTab memberId={member?.id} />
                    </Suspense>
                </TabsContent>
                <TabsContent value="billing">
                    <BillingTab memberId={member?.id} />
                </TabsContent>
            </Tabs>
        </main>
    );
};

export default MemberPage;

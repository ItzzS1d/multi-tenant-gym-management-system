import { getTrainersList } from "@/features/staff/staff-queries";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const trainers = await getTrainersList();
        return NextResponse.json(trainers);
    } catch (error) {
        console.error("Error in trainers API:", error);
        return NextResponse.json(
            { error: "Failed to fetch trainers" },
            { status: 500 },
        );
    }
}

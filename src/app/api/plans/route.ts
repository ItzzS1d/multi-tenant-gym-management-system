import { NextResponse } from "next/server";
import { getActivePlans } from "@/features/plans/queries";

export async function GET() {
    try {
        const plans = await getActivePlans();
        return NextResponse.json(plans);
    } catch (error) {
        console.error("Error in active plans API:", error);
        return NextResponse.json({ error: "Failed to fetch active plans" }, { status: 500 });
    }
}

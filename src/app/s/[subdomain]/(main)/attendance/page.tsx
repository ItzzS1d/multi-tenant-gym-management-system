import { Metadata } from "next";
import { RedirectType } from "next/navigation";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Attendance",
    description: "Track member check-ins and attendance history.",
};

const Attendance = () => {
    redirect("/attendance/records", RedirectType.replace);
};

export default Attendance;

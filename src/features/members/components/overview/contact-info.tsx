import ContactInfoEditBtn from "./contact-info-edit-btn";
import { getMemberOverViewDetails } from "../../new/queries";
import { Contact, User } from "lucide-react";
import { formatDate } from "@/shared/lib/utils";

const ContactInfo = async ({
    memberOverviewPromise,
}: {
    memberOverviewPromise: ReturnType<typeof getMemberOverViewDetails>;
}) => {
    const memberData = await memberOverviewPromise;

    return (
        <>
            {/* Contact Information */}
            <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-medium text-text-main-light dark:text-text-main-dark flex items-center gap-2">
                        <span className=" text-primary">
                            <Contact />
                        </span>
                        Contact Information
                    </h3>
                    <ContactInfoEditBtn />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                        <p className="text-sm font-medium text-primary dark:text-text-sub-dark uppercase tracking-wide">
                            EMAIL ADDRESS
                        </p>
                        <p className="text-base text-text-main-light dark:text-text-main-dark mt-1 font-medium break-all">
                            {memberData.user.email}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-primary dark:text-text-sub-dark uppercase tracking-wide">
                            PHONE NUMBER
                        </p>
                        <p className=" font-medium break-all">
                            {memberData.user.phone}
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm font-medium text-primary dark:text-text-sub-dark uppercase tracking-wide">
                            PHYSICAL ADDRESS
                        </p>
                        <p className="">
                            {memberData?.memberDetails?.address || "N/A"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Personal Details */}
            <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-[#e7f3eb] dark:border-[#2a4034]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-text-main-light dark:text-text-main-dark flex items-center gap-2">
                        <span className=" text-primary">
                            <User />
                        </span>
                        Personal Details
                    </h3>
                    <ContactInfoEditBtn />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4">
                    <div>
                        <p className="text-sm font-medium text-primary dark:text-text-sub-dark uppercase tracking-wide">
                            DATE OF BIRTH
                        </p>
                        <p className="text-base text-text-main-light dark:text-text-main-dark mt-1 font-medium break-all">
                            {formatDate(
                                memberData?.memberDetails?.dob || new Date(),
                            ) || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-primary dark:text-text-sub-dark uppercase tracking-wide">
                            GENDER
                        </p>
                        <p className="text-base text-text-main-light dark:text-text-main-dark mt-1 font-medium break-all">
                            {memberData?.memberDetails?.gender || "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-primary dark:text-text-sub-dark uppercase tracking-wide">
                            EMERGENCY CONTACT
                        </p>
                        <p className="text-base text-text-main-light dark:text-text-main-dark mt-1 font-medium break-all whitespace-pre-line">
                            {memberData?.memberDetails?.emergencyName &&
                            memberData?.memberDetails?.relationship &&
                            memberData?.memberDetails?.emergencyPhone
                                ? `${memberData.memberDetails.emergencyName} (${memberData.memberDetails.relationship})\n${memberData.memberDetails.emergencyPhone}`
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactInfo;

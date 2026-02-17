export { sendOnboardingLink, sendSignupVerificationCode } from "./sendmail";
export {
    generateRegistrationEmail,
    type RegistrationEmailParams,
} from "./templates/resetPassword";

const nums = [2, 7, 11, 15];
const target = 9;

for (const num of nums) {
    if (nums[num] + (nums[num] + 1) === target) {
        console.info("Found");
    } else {
        console.info("Not found");
    }
}

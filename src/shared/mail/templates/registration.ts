export interface RegistrationEmailParams {
    name: string;
    verificationLink: string;
    companyName?: string;
}

export const generateRegistrationEmail = ({
    name,
    verificationLink,
    companyName = "Gym Mart",
}: RegistrationEmailParams): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 500px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden;">

          <!-- Content -->
          <tr>
            <td style="padding: 48px 32px; text-align: center;">
              <h1 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                Welcome to ${companyName}!
              </h1>

              <p style="margin: 0 0 32px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                Hi ${name}, thanks for signing up! Please verify your email address to get started.
              </p>

              <!-- Button -->
              <a href="${verificationLink}" style="display: inline-block; padding: 14px 32px; background-color: #5252F4; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 15px; transition: background-color 0.2s;">
                Verify Email Address
              </a>

              <p style="margin: 32px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.5;">
                This link expires in 5 minutes. If you didn't create an account, you can ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                ${companyName} • Automated message
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

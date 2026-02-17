
export interface InvitationEmailParams {
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
  primaryColor?: string;
}

export const generateInvitationEmail = ({
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
  primaryColor = "#7c3aed",
}: InvitationEmailParams) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join ${teamName}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }
    .header {
      background: ${primaryColor};
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 32px 24px;
    }
    .message {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 24px;
    }
    .inviter-info {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 6px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar-placeholder {
      width: 40px;
      height: 40px;
      background: #e5e7eb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #6b7280;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      background-color: ${primaryColor};
      color: white !important;
      padding: 12px 32px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      display: inline-block;
      transition: background-color 0.2s;
    }
    .button:hover {
      opacity: 0.9;
    }
    .footer {
      text-align: center;
      padding: 24px;
      font-size: 14px;
      color: #9ca3af;
    }
    .link-break {
        word-break: break-all;
        color: #6b7280;
        font-size: 12px;
        margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>GymMart</h1>
      </div>
      <div class="content">
        <h2 style="margin-top: 0; color: #111827; font-size: 20px; font-weight: 600;">You've been invited!</h2>
        
        <p class="message">
          <strong>${invitedByUsername}</strong> has invited you to join the team at <strong>${teamName}</strong>.
        </p>

        <div class="inviter-info">
            <div style="font-size: 14px; color: #374151;">
                <div style="font-weight: 600;">${invitedByUsername}</div>
                <div style="color: #6b7280;">${invitedByEmail}</div>
            </div>
        </div>

        <div class="button-container">
          <a href="${inviteLink}" class="button">Accept Invitation</a>
        </div>

        <p style="font-size: 14px; color: #6b7280; text-align: center;">
          This invitation is valid for 7 days. If you were not expecting this invitation, you can ignore this email.
        </p>
      </div>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} GymSaas. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
};

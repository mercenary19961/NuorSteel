<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You have been invited to Nuor Steel</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; color: #1f2937; }
        .wrapper { max-width: 600px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: #FF7A00; color: #ffffff; padding: 28px 24px; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
        .body { padding: 28px 24px; }
        .body p { margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #1f2937; }
        .meta { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px 16px; margin: 16px 0; font-size: 14px; }
        .meta-row { display: flex; justify-content: space-between; padding: 4px 0; }
        .meta-label { color: #6b7280; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .meta-value { color: #1f2937; font-weight: 500; }
        .cta-wrapper { text-align: center; margin: 28px 0 16px; }
        .cta-button { display: inline-block; background: #FF7A00; color: #ffffff !important; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none; }
        .fallback { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-top: 12px; font-size: 13px; color: #4b5563; word-break: break-all; }
        .fallback-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 20px; font-size: 13px; color: #92400e; line-height: 1.5; }
        .footer { padding: 16px 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>Welcome to Nuor Steel</h1>
                <p>An admin has invited you to the admin panel.</p>
            </div>
            <div class="body">
                <p>Hi {{ $userName }},</p>
                <p>{{ $invitedBy }} has invited you to manage content for Nuor Steel Industry Company. Click the button below to set your password and activate your account.</p>

                <div class="meta">
                    <div class="meta-row">
                        <span class="meta-label">Role</span>
                        <span class="meta-value">{{ ucfirst($role) }}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Invited by</span>
                        <span class="meta-value">{{ $invitedBy }}</span>
                    </div>
                </div>

                <div class="cta-wrapper">
                    <a href="{{ $acceptUrl }}" class="cta-button">Accept invite & set password</a>
                </div>

                <div class="fallback-label">Or paste this link into your browser</div>
                <div class="fallback">{{ $acceptUrl }}</div>

                <div class="note">
                    This invite link expires in {{ $expiryHours }} hours. If it expires, ask the admin to resend the invite.
                </div>
            </div>
            <div class="footer">
                Nuor Steel Industry Company &middot; This is an automated invitation email.
            </div>
        </div>
    </div>
</body>
</html>

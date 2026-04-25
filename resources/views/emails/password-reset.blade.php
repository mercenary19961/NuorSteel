<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset your Nuor Steel admin password</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; color: #1f2937; }
        .wrapper { max-width: 600px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: #FF7A00; color: #ffffff; padding: 24px; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.9; }
        .body { padding: 28px 24px; }
        .body p { margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #1f2937; }
        .cta-wrapper { text-align: center; margin: 24px 0; }
        .cta-button { display: inline-block; background: #FF7A00; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none; }
        .fallback { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px; margin-top: 16px; font-size: 13px; color: #4b5563; word-break: break-all; }
        .fallback-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 20px; font-size: 13px; color: #92400e; line-height: 1.5; }
        .footer { padding: 16px 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>Reset your password</h1>
                <p>Nuor Steel admin panel</p>
            </div>
            <div class="body">
                <p>Hi {{ $userName }},</p>
                <p>We received a request to reset your password. Click the button below to choose a new one. This link will expire in {{ $expiryMinutes }} minutes.</p>

                <div class="cta-wrapper">
                    <a href="{{ $resetUrl }}" class="cta-button">Reset password</a>
                </div>

                <div class="fallback-label">Or paste this link into your browser</div>
                <div class="fallback">{{ $resetUrl }}</div>

                <div class="note">
                    If you didn't request a password reset, you can safely ignore this email — your password will not change.
                </div>
            </div>
            <div class="footer">
                Nuor Steel Industry Company &middot; This is an automated security email.
            </div>
        </div>
    </div>
</body>
</html>

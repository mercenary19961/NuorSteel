<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Submission</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; color: #1f2937; }
        .wrapper { max-width: 600px; margin: 0 auto; padding: 24px; }
        .card { background: #ffffff; border-radius: 8px; overflow: hidden; }
        .header { background: #1e40af; color: #ffffff; padding: 24px; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
        .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.85; }
        .body { padding: 24px; }
        .field { margin-bottom: 16px; }
        .field-label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .field-value { font-size: 15px; color: #1f2937; }
        .message-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin-top: 8px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; background: #dbeafe; color: #1e40af; }
        .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px; margin-top: 16px; font-size: 13px; color: #92400e; }
        .footer { padding: 16px 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
        hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>New Contact Submission</h1>
                <p>{{ $submission->subject }}</p>
            </div>
            <div class="body">
                <div class="field">
                    <div class="field-label">Request Type</div>
                    <div class="field-value">
                        <span class="badge">{{ $submission->getRequestTypeLabel() }}</span>
                    </div>
                </div>

                <hr>

                <div class="field">
                    <div class="field-label">Name</div>
                    <div class="field-value">{{ $submission->name }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Company</div>
                    <div class="field-value">{{ $submission->company }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value">{{ $submission->email }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Phone</div>
                    <div class="field-value">{{ $submission->phone }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Country</div>
                    <div class="field-value">{{ $submission->country }}</div>
                </div>

                <hr>

                <div class="field">
                    <div class="field-label">Message</div>
                    <div class="message-box">{{ $submission->message }}</div>
                </div>

                @if($submission->hasFile())
                    <div class="note">
                        This submission includes a file attachment. View it in the admin panel.
                    </div>
                @endif
            </div>
            <div class="footer">
                Nuor Steel Industry Company &mdash; Admin Notification
            </div>
        </div>
    </div>
</body>
</html>

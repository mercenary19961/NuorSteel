<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Career Application</title>
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
        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-gray { background: #f3f4f6; color: #374151; }
        .note { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 12px; margin-top: 16px; font-size: 13px; color: #0c4a6e; }
        .footer { padding: 16px 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
        hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>New Career Application</h1>
                <p>{{ $application->job_title }}</p>
            </div>
            <div class="body">
                @if($listing)
                    <div class="field">
                        <div class="field-label">Applied For</div>
                        <div class="field-value">
                            <span class="badge badge-green">{{ $listing->title_en }}</span>
                        </div>
                    </div>
                @else
                    <div class="field">
                        <div class="field-label">Application Type</div>
                        <div class="field-value">
                            <span class="badge badge-gray">Open Application</span>
                        </div>
                    </div>
                @endif

                <hr>

                <div class="field">
                    <div class="field-label">Name</div>
                    <div class="field-value">{{ $application->name }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value">{{ $application->email }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Phone</div>
                    <div class="field-value">{{ $application->phone }}</div>
                </div>

                <div class="field">
                    <div class="field-label">Desired Job Title</div>
                    <div class="field-value">{{ $application->job_title }}</div>
                </div>

                <div class="note">
                    The applicant's CV has been uploaded and is available in the admin panel under Applications.
                </div>
            </div>
            <div class="footer">
                Nuor Steel Industry Company &mdash; Admin Notification
            </div>
        </div>
    </div>
</body>
</html>

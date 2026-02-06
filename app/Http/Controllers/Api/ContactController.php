<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function submit(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'country' => 'required|string|max:100',
            'request_type' => 'required|in:vendor,partnership,careers,sustainability,general,quotation',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
            'file' => 'nullable|file|mimes:pdf|mimetypes:application/pdf|max:5120',
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('attachments', 'local');
        }

        $submission = ContactSubmission::create([
            'name' => trim(strip_tags($request->name)),
            'company' => trim(strip_tags($request->company)),
            'email' => trim($request->email),
            'phone' => trim(strip_tags($request->phone)),
            'country' => trim(strip_tags($request->country)),
            'request_type' => $request->request_type,
            'subject' => trim(strip_tags($request->subject)),
            'message' => trim(strip_tags($request->message)),
            'file_path' => $filePath,
        ]);

        // Send notification email
        $this->sendContactNotification($submission);

        return response()->json([
            'success' => true,
            'message' => 'Your message has been sent successfully. We will get back to you soon.',
            'data' => [
                'id' => $submission->id,
            ],
        ], 201);
    }

    private function sendContactNotification(ContactSubmission $submission): void
    {
        $recipients = Setting::get('contact_recipients', 'info@nuorsteel.com,it@nuorsteel.com');
        $emails = array_map('trim', explode(',', $recipients));

        // In production, you would send an actual email here
        // Mail::to($emails)->send(new ContactFormSubmitted($submission));
    }
}

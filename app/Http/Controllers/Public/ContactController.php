<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\SiteContent;
use App\Models\Setting;
use App\Mail\ContactFormSubmitted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        $locale = session('locale', 'en');

        return Inertia::render('Public/Contact', [
            'content' => SiteContent::getPage('contact', $locale),
            'settings' => [
                'phone' => Setting::get('company_phone'),
                'email' => Setting::get('company_email'),
                'address' => Setting::get($locale === 'ar' ? 'company_address_ar' : 'company_address_en'),
            ],
        ]);
    }

    public function store(Request $request)
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

        $this->sendContactNotification($submission);

        return back()->with('success', 'Your message has been sent successfully. We will get back to you soon.');
    }

    private function sendContactNotification(ContactSubmission $submission): void
    {
        try {
            $recipients = Setting::get('contact_recipients', 'info@nuorsteel.com,it@nuorsteel.com');
            $emails = array_map('trim', explode(',', $recipients));

            Mail::to($emails)->send(new ContactFormSubmitted($submission));
        } catch (\Throwable $e) {
            Log::error('Failed to send contact notification email', [
                'submission_id' => $submission->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

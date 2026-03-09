<?php

namespace App\Mail;

use App\Models\ContactSubmission;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactSubmission $submission,
    ) {}

    public function envelope(): Envelope
    {
        $safeSubject = str_replace(["\r", "\n", "\t"], '', $this->submission->subject);

        return new Envelope(
            subject: 'New Contact Submission: ' . mb_substr($safeSubject, 0, 100),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-submitted',
        );
    }
}

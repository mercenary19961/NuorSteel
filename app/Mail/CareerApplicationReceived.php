<?php

namespace App\Mail;

use App\Models\CareerApplication;
use App\Models\CareerListing;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CareerApplicationReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public CareerApplication $application,
        public ?CareerListing $listing = null,
    ) {}

    public function envelope(): Envelope
    {
        $safeTitle = str_replace(["\r", "\n", "\t"], '', $this->application->job_title);

        return new Envelope(
            subject: 'New Career Application: ' . mb_substr($safeTitle, 0, 100),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.career-application',
        );
    }
}

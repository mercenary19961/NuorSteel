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
        return new Envelope(
            subject: 'New Career Application: ' . $this->application->job_title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.career-application',
        );
    }
}

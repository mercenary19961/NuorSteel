<?php

namespace Tests\Feature;

use App\Mail\CareerApplicationReceived;
use App\Mail\ContactFormSubmitted;
use App\Models\CareerApplication;
use App\Models\CareerListing;
use App\Models\ContactSubmission;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FormSubmissionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');

        Setting::create(['key' => 'contact_recipients', 'value' => 'test@example.com', 'type' => 'text', 'group' => 'email']);
        Setting::create(['key' => 'career_recipients', 'value' => 'test@example.com', 'type' => 'text', 'group' => 'email']);
    }

    private function validContactData(array $overrides = []): array
    {
        return array_merge([
            'name' => 'John Doe',
            'company' => 'Acme Corp',
            'email' => 'john@example.com',
            'phone' => '+966501234567',
            'country' => 'Saudi Arabia',
            'request_type' => 'general',
            'subject' => 'General inquiry',
            'message' => 'I would like to know more about your products.',
        ], $overrides);
    }

    private function validCareerData(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '+966509876543',
            'job_title' => 'Mechanical Engineer',
            'cv' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
        ], $overrides);
    }

    private function createOpenCareerListing(): CareerListing
    {
        return CareerListing::create([
            'title_en' => 'Mechanical Engineer',
            'title_ar' => 'مهندس ميكانيكي',
            'slug' => 'mechanical-engineer',
            'description_en' => 'We are looking for a mechanical engineer.',
            'description_ar' => 'نبحث عن مهندس ميكانيكي.',
            'employment_type' => 'full-time',
            'status' => 'open',
        ]);
    }

    // -------------------------------------------------------
    // Contact Form Tests
    // -------------------------------------------------------

    public function test_contact_form_submits_successfully_with_valid_data(): void
    {
        Mail::fake();

        $response = $this->post('/contact', $this->validContactData());

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_submissions', [
            'name' => 'John Doe',
            'company' => 'Acme Corp',
            'email' => 'john@example.com',
            'phone' => '+966501234567',
            'country' => 'Saudi Arabia',
            'request_type' => 'general',
            'subject' => 'General inquiry',
        ]);
    }

    public function test_contact_form_validates_required_fields(): void
    {
        $response = $this->post('/contact', []);

        $response->assertSessionHasErrors([
            'name',
            'company',
            'email',
            'phone',
            'country',
            'request_type',
            'subject',
            'message',
        ]);

        $this->assertDatabaseCount('contact_submissions', 0);
    }

    public function test_contact_form_validates_email_format(): void
    {
        $response = $this->post('/contact', $this->validContactData([
            'email' => 'not-an-email',
        ]));

        $response->assertSessionHasErrors(['email']);
    }

    public function test_contact_form_validates_request_type_enum(): void
    {
        $response = $this->post('/contact', $this->validContactData([
            'request_type' => 'invalid_type',
        ]));

        $response->assertSessionHasErrors(['request_type']);
    }

    // -------------------------------------------------------
    // Career Application Tests
    // -------------------------------------------------------

    public function test_career_application_submits_successfully_with_pdf(): void
    {
        Mail::fake();

        $response = $this->post('/career/apply', $this->validCareerData());

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('career_applications', [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '+966509876543',
            'job_title' => 'Mechanical Engineer',
            'career_listing_id' => null,
        ]);

        $application = CareerApplication::first();
        Storage::disk('local')->assertExists($application->cv_path);
    }

    public function test_career_application_for_specific_job_links_to_listing(): void
    {
        Mail::fake();

        $listing = $this->createOpenCareerListing();

        $response = $this->post('/career/mechanical-engineer/apply', $this->validCareerData());

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('career_applications', [
            'career_listing_id' => $listing->id,
            'name' => 'Jane Smith',
        ]);
    }

    public function test_career_application_validates_required_fields(): void
    {
        $response = $this->post('/career/apply', []);

        $response->assertSessionHasErrors([
            'name',
            'email',
            'phone',
            'job_title',
            'cv',
        ]);

        $this->assertDatabaseCount('career_applications', 0);
    }

    public function test_career_application_rejects_non_pdf_file(): void
    {
        $response = $this->post('/career/apply', $this->validCareerData([
            'cv' => UploadedFile::fake()->create('resume.docx', 100, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
        ]));

        $response->assertSessionHasErrors(['cv']);
        $this->assertDatabaseCount('career_applications', 0);
    }

    public function test_career_application_rejects_file_over_5mb(): void
    {
        $response = $this->post('/career/apply', $this->validCareerData([
            'cv' => UploadedFile::fake()->create('cv.pdf', 6000, 'application/pdf'),
        ]));

        $response->assertSessionHasErrors(['cv']);
        $this->assertDatabaseCount('career_applications', 0);
    }

    // -------------------------------------------------------
    // Email Notification Tests
    // -------------------------------------------------------

    public function test_contact_submission_triggers_email_notification(): void
    {
        Mail::fake();

        $this->post('/contact', $this->validContactData());

        Mail::assertSent(ContactFormSubmitted::class, function (ContactFormSubmitted $mail) {
            return $mail->submission->email === 'john@example.com';
        });
    }

    public function test_career_application_triggers_email_notification(): void
    {
        Mail::fake();

        $this->post('/career/apply', $this->validCareerData());

        Mail::assertSent(CareerApplicationReceived::class, function (CareerApplicationReceived $mail) {
            return $mail->application->email === 'jane@example.com';
        });
    }
}

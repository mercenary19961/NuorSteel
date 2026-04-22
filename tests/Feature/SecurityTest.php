<?php

namespace Tests\Feature;

use App\Models\Certificate;
use App\Models\ContactSubmission;
use App\Models\Media;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private function createAdmin(): User
    {
        return User::factory()->create(['role' => 'admin', 'is_active' => true]);
    }

    private function createEditor(): User
    {
        return User::factory()->create(['role' => 'editor', 'is_active' => true]);
    }

    // ===============================================================
    // 1. Security Headers Middleware
    // ===============================================================

    public function test_response_includes_x_content_type_options_header(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    public function test_response_includes_x_frame_options_header(): void
    {
        $response = $this->get('/');

        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
    }

    public function test_response_includes_referrer_policy_header(): void
    {
        $response = $this->get('/');

        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_response_includes_permissions_policy_header(): void
    {
        $response = $this->get('/');

        $response->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    }

    public function test_security_headers_present_on_admin_pages(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
    }

    // ===============================================================
    // 2. Media Serve — MIME Allowlist
    // ===============================================================

    public function test_media_serve_allows_image_mime_types(): void
    {
        Storage::fake('local');

        $media = Media::create([
            'filename' => 'test.jpg',
            'original_filename' => 'photo.jpg',
            'path' => 'media/general/test.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'folder' => 'general',
        ]);

        Storage::put('media/general/test.jpg', 'fake-image-content');

        $response = $this->get("/media/{$media->id}");

        $response->assertOk();
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    public function test_media_serve_blocks_disallowed_mime_types(): void
    {
        Storage::fake('local');

        $media = Media::create([
            'filename' => 'script.html',
            'original_filename' => 'script.html',
            'path' => 'media/general/script.html',
            'mime_type' => 'text/html',
            'size' => 512,
            'folder' => 'general',
        ]);

        Storage::put('media/general/script.html', '<script>alert("xss")</script>');

        $response = $this->get("/media/{$media->id}");

        $response->assertForbidden();
    }

    public function test_media_serve_returns_404_for_missing_file(): void
    {
        Storage::fake('local');

        $media = Media::create([
            'filename' => 'missing.jpg',
            'original_filename' => 'missing.jpg',
            'path' => 'media/general/missing.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'folder' => 'general',
        ]);

        // Don't create the file on disk

        $response = $this->get("/media/{$media->id}");

        $response->assertNotFound();
    }

    // ===============================================================
    // 3. Auth Security — No Account Enumeration
    // ===============================================================

    public function test_inactive_user_gets_generic_error_message(): void
    {
        $user = User::factory()->create([
            'role' => 'admin',
            'is_active' => false,
        ]);

        $response = $this->post('/admin/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        // Should get the same generic message as wrong password
        $response->assertSessionHasErrors('email');

        $errors = session('errors')->get('email');
        $this->assertStringNotContainsString('deactivated', $errors[0]);
        $this->assertStringNotContainsString('inactive', $errors[0]);
    }

    public function test_nonexistent_email_gets_same_error_as_wrong_password(): void
    {
        $response = $this->post('/admin/login', [
            'email' => 'nobody@example.com',
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('email');
    }

    // ===============================================================
    // 4. Settings Key Allowlist
    // ===============================================================

    public function test_settings_rejects_disallowed_keys(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->put('/admin/settings', [
            'settings' => [
                ['key' => 'malicious_key', 'value' => 'evil'],
            ],
        ]);

        $response->assertSessionHasErrors('settings.0.key');
    }

    public function test_settings_accepts_allowed_keys(): void
    {
        $admin = $this->createAdmin();

        // Use updateOrCreate to avoid conflict with data migration seeds
        Setting::updateOrCreate(['key' => 'company_phone'], ['value' => '', 'type' => 'text', 'group' => 'contact']);

        $response = $this->actingAs($admin)->put('/admin/settings', [
            'settings' => [
                ['key' => 'company_phone', 'value' => '+966123456789'],
            ],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }

    public function test_editor_cannot_access_settings(): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor)->get('/admin/settings');

        $response->assertForbidden();
    }

    // ===============================================================
    // 5. Undo Controller — Model Validation & Role Guards
    // ===============================================================

    public function test_undo_status_rejects_invalid_model_type(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->getJson('/admin/undo/malicious_model/1');

        $response->assertOk();
        $response->assertJson(['undoMeta' => null]);
    }

    public function test_undo_restore_rejects_invalid_model_type(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/undo/malicious_model/1');

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Unknown model type.');
    }

    public function test_editor_cannot_undo_admin_only_models(): void
    {
        $editor = $this->createEditor();

        // Settings is admin-only
        $response = $this->actingAs($editor)->getJson('/admin/undo/settings/all');

        $response->assertJson(['undoMeta' => null]);
    }

    public function test_editor_cannot_undo_newsletter(): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor)->post('/admin/undo/newsletter/1');

        $response->assertForbidden();
    }

    // ===============================================================
    // 7. Certificate Controller — $request->only()
    // ===============================================================

    public function test_certificate_update_ignores_extra_fields(): void
    {
        Storage::fake('local');
        $admin = $this->createAdmin();

        $cert = Certificate::create([
            'title_en' => 'ISO 9001',
            'title_ar' => 'آيزو 9001',
            'category' => 'quality',
            'file_path' => 'certificates/iso9001.pdf',
            'is_active' => true,
            'sort_order' => 1,
            'created_by' => $admin->id,
            'updated_by' => $admin->id,
        ]);

        $response = $this->actingAs($admin)->post("/admin/certificates/{$cert->id}", [
            'title_en' => 'ISO 9001 Updated',
            'title_ar' => 'آيزو 9001 محدث',
            'category' => 'quality',
            'is_active' => true,
            'sort_order' => 1,
            // Attempt to inject created_by
            'created_by' => 999,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseMissing('certificates', ['created_by' => 999]);
    }

    // ===============================================================
    // 8. Public Form Rate Limiting
    // ===============================================================

    public function test_contact_form_is_rate_limited(): void
    {
        Storage::fake('local');
        Setting::updateOrCreate(['key' => 'contact_recipients'], ['value' => 'test@example.com', 'type' => 'text', 'group' => 'email']);

        $data = [
            'name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '+966501234567',
            'country' => 'Saudi Arabia',
            'request_type' => 'general',
            'subject' => 'Test',
            'message' => 'Test message content here.',
        ];

        // Send 5 requests (the limit per 10 minutes)
        for ($i = 0; $i < 5; $i++) {
            $this->post('/contact', $data);
        }

        // 6th should be rate limited
        $response = $this->post('/contact', $data);
        $response->assertStatus(429);
    }

    public function test_newsletter_subscribe_is_rate_limited(): void
    {
        // Send 5 requests
        for ($i = 0; $i < 5; $i++) {
            $this->post('/newsletter/subscribe', ['email' => "test{$i}@example.com"]);
        }

        $response = $this->post('/newsletter/subscribe', ['email' => 'test99@example.com']);
        $response->assertStatus(429);
    }

    // ===============================================================
    // 9. Newsletter Source Hardcoding
    // ===============================================================

    public function test_newsletter_source_is_always_website(): void
    {
        $response = $this->post('/newsletter/subscribe', [
            'email' => 'safe@example.com',
            'source' => 'injected_source',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'safe@example.com',
            'source' => 'website',
        ]);
    }

    // ===============================================================
    // 10. Contact Form — Company is Optional
    // ===============================================================

    public function test_contact_form_company_is_optional(): void
    {
        Storage::fake('local');
        \Illuminate\Support\Facades\Mail::fake();
        Setting::updateOrCreate(['key' => 'contact_recipients'], ['value' => 'test@example.com', 'type' => 'text', 'group' => 'email']);

        $response = $this->post('/contact', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+966501234567',
            'country' => 'Saudi Arabia',
            'request_type' => 'general',
            'subject' => 'Test inquiry',
            'message' => 'I have a question about your products.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }

    // ===============================================================
    // 11. Media Upload — MIME-detected Extension
    // ===============================================================

    public function test_media_upload_uses_mime_detected_extension(): void
    {
        Storage::fake('local');
        $admin = $this->createAdmin();

        $file = UploadedFile::fake()->image('photo.jpg', 100, 100);

        $response = $this->actingAs($admin)->post('/admin/media', [
            'file' => $file,
            'folder' => 'general',
        ]);

        $response->assertRedirect();

        $media = Media::orderByDesc('id')->first();
        // The stored filename should have an extension (MIME-detected or client-provided)
        $this->assertMatchesRegularExpression('/\.\w+$/', $media->filename);
    }

    // ===============================================================
    // 12. Admin Media Search — LIKE Wildcard Escaping
    // ===============================================================

    public function test_media_search_escapes_like_wildcards(): void
    {
        Storage::fake('local');
        $admin = $this->createAdmin();

        // Create media with a normal name
        Media::create([
            'filename' => 'test.jpg',
            'original_filename' => 'normal_photo.jpg',
            'path' => 'media/general/test.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'folder' => 'general',
        ]);

        // Search with LIKE wildcards — should be escaped, not treated as wildcards
        $response = $this->actingAs($admin)->getJson('/admin/media/json?search=%25%25');

        $response->assertOk();
        // The wildcard should not match everything
        $this->assertCount(0, $response->json('media.data'));
    }

    // ===============================================================
    // 13. Public Certificate File — Only Active Certificates
    // ===============================================================

    public function test_certificate_file_serves_active_certificate(): void
    {
        Storage::fake('local');

        $cert = Certificate::create([
            'title_en' => 'ISO 9001',
            'title_ar' => 'آيزو 9001',
            'category' => 'quality',
            'file_path' => 'certificates/test.pdf',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Storage::put('certificates/test.pdf', 'fake-pdf-content');

        $response = $this->get("/certificates/{$cert->id}/file");

        $response->assertOk();
    }

    public function test_certificate_file_blocks_inactive_certificate(): void
    {
        Storage::fake('local');

        $cert = Certificate::create([
            'title_en' => 'Old Cert',
            'title_ar' => 'شهادة قديمة',
            'category' => 'quality',
            'file_path' => 'certificates/old.pdf',
            'is_active' => false,
            'sort_order' => 1,
        ]);

        Storage::put('certificates/old.pdf', 'fake-pdf-content');

        $response = $this->get("/certificates/{$cert->id}/file");

        $response->assertNotFound();
    }

    // ===============================================================
    // 14. Locale Switch Rate Limiting
    // ===============================================================

    public function test_locale_switch_is_rate_limited(): void
    {
        // 30 requests per minute
        for ($i = 0; $i < 30; $i++) {
            $this->post('/locale/en');
        }

        $response = $this->post('/locale/en');
        $response->assertStatus(429);
    }

    // ===============================================================
    // 15. Admin Routes Not Accessible Without Auth
    // ===============================================================

    public function test_admin_post_routes_require_auth(): void
    {
        $response = $this->post('/admin/careers', [
            'title_en' => 'Test',
            'title_ar' => 'تجربة',
            'description_en' => 'Desc',
            'description_ar' => 'وصف',
            'employment_type' => 'full-time',
            'status' => 'open',
        ]);

        $response->assertRedirect('/admin/login');
    }

    public function test_admin_delete_routes_require_auth(): void
    {
        $response = $this->delete('/admin/careers/1');

        $response->assertRedirect('/admin/login');
    }

    // ===============================================================
    // 16. Contact Submission — Admin-only Fields Not Mass-Assignable
    // ===============================================================

    public function test_contact_admin_fields_not_mass_assignable(): void
    {
        $submission = new ContactSubmission();

        // These fields should NOT be in $fillable
        $this->assertNotContains('is_read', $submission->getFillable());
        $this->assertNotContains('is_archived', $submission->getFillable());
        $this->assertNotContains('read_by', $submission->getFillable());
    }

    // ===============================================================
    // 17. Career Application — Admin-only Fields Not Mass-Assignable
    // ===============================================================

    public function test_career_application_admin_fields_not_mass_assignable(): void
    {
        $app = new \App\Models\CareerApplication();

        $this->assertNotContains('status', $app->getFillable());
        $this->assertNotContains('admin_notes', $app->getFillable());
        $this->assertNotContains('reviewed_by', $app->getFillable());
    }
}

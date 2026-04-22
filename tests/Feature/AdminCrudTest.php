<?php

namespace Tests\Feature;

use App\Models\CareerApplication;
use App\Models\CareerListing;
use App\Models\Certificate;
use App\Models\ContactSubmission;
use App\Models\LinkedinCache;
use App\Models\Media;
use App\Models\NewsletterSubscriber;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminCrudTest extends TestCase
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
    // LinkedIn Posts CRUD
    // ===============================================================

    public function test_linkedin_posts_index_renders(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get('/admin/linkedin-posts');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/LinkedinPosts')
            ->has('posts')
            ->has('stats')
        );
    }

    public function test_linkedin_posts_store_with_embed_code(): void
    {
        $admin = $this->createAdmin();

        $embedCode = '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:activity:7654321098765432100" height="600" width="504"></iframe>';

        $response = $this->actingAs($admin)->post('/admin/linkedin-posts', [
            'post_input' => $embedCode,
            'content' => 'Test post content',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('linkedin_cache', [
            'post_id' => 'urn:li:activity:7654321098765432100',
            'content' => 'Test post content',
        ]);
    }

    public function test_linkedin_posts_store_rejects_invalid_url(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/linkedin-posts', [
            'post_input' => 'https://example.com/not-a-linkedin-post',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors('post_input');
    }

    public function test_linkedin_posts_store_rejects_duplicate(): void
    {
        $admin = $this->createAdmin();

        LinkedinCache::create([
            'post_id' => 'urn:li:activity:1234567890',
            'content' => 'Existing post',
            'post_url' => 'https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890',
            'posted_at' => now(),
            'synced_at' => now(),
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($admin)->post('/admin/linkedin-posts', [
            'post_input' => '<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890"></iframe>',
        ]);

        $response->assertSessionHasErrors('post_input');
    }

    public function test_linkedin_posts_toggle_visibility(): void
    {
        $admin = $this->createAdmin();

        $post = LinkedinCache::create([
            'post_id' => 'urn:li:activity:9999999999',
            'content' => 'Toggle test',
            'post_url' => 'https://linkedin.com/test',
            'posted_at' => now(),
            'synced_at' => now(),
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($admin)->post("/admin/linkedin-posts/{$post->id}/toggle");

        $response->assertRedirect();
        $this->assertDatabaseHas('linkedin_cache', ['id' => $post->id, 'is_active' => false]);
    }

    public function test_linkedin_posts_destroy_soft_deletes(): void
    {
        $admin = $this->createAdmin();

        $post = LinkedinCache::create([
            'post_id' => 'urn:li:activity:8888888888',
            'content' => 'Delete test',
            'post_url' => 'https://linkedin.com/test',
            'posted_at' => now(),
            'synced_at' => now(),
            'is_active' => true,
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/linkedin-posts/{$post->id}");

        $response->assertRedirect();
        $this->assertSoftDeleted('linkedin_cache', ['id' => $post->id]);
    }

    // ===============================================================
    // Contact Submissions — Admin Actions
    // ===============================================================

    public function test_contacts_index_renders(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get('/admin/contacts');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Contacts')
            ->has('submissions')
            ->has('stats')
        );
    }

    public function test_contact_mark_as_read(): void
    {
        $admin = $this->createAdmin();

        $submission = ContactSubmission::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+966501234567',
            'country' => 'Saudi Arabia',
            'request_type' => 'general',
            'subject' => 'Test',
            'message' => 'Hello',
        ]);

        $response = $this->actingAs($admin)->post("/admin/contacts/{$submission->id}/read");

        $response->assertRedirect();
        $this->assertDatabaseHas('contact_submissions', [
            'id' => $submission->id,
            'is_read' => true,
            'read_by' => $admin->id,
        ]);
    }

    public function test_contact_archive_and_unarchive(): void
    {
        $admin = $this->createAdmin();

        $submission = ContactSubmission::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+966501234567',
            'country' => 'Saudi Arabia',
            'request_type' => 'general',
            'subject' => 'Test',
            'message' => 'Hello',
        ]);

        // Archive
        $response = $this->actingAs($admin)->post("/admin/contacts/{$submission->id}/archive");
        $response->assertRedirect();
        $this->assertDatabaseHas('contact_submissions', ['id' => $submission->id, 'is_archived' => true]);

        // Unarchive
        $response = $this->actingAs($admin)->post("/admin/contacts/{$submission->id}/unarchive");
        $response->assertRedirect();
        $this->assertDatabaseHas('contact_submissions', ['id' => $submission->id, 'is_archived' => false]);
    }

    public function test_contact_destroy_soft_deletes(): void
    {
        $admin = $this->createAdmin();

        $submission = ContactSubmission::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+966501234567',
            'country' => 'Saudi Arabia',
            'request_type' => 'general',
            'subject' => 'Test',
            'message' => 'Hello',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/contacts/{$submission->id}");

        $response->assertRedirect();
        $this->assertSoftDeleted('contact_submissions', ['id' => $submission->id]);
    }

    // ===============================================================
    // Settings — Admin Only CRUD
    // ===============================================================

    public function test_settings_index_renders_for_admin(): void
    {
        $admin = $this->createAdmin();

        Setting::updateOrCreate(['key' => 'company_phone'], ['value' => '+966', 'type' => 'text', 'group' => 'contact']);

        $response = $this->actingAs($admin)->get('/admin/settings');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('Admin/Settings'));
    }

    public function test_settings_update_applies_changes(): void
    {
        $admin = $this->createAdmin();

        Setting::updateOrCreate(['key' => 'company_phone'], ['value' => '+966000', 'type' => 'text', 'group' => 'contact']);
        Setting::updateOrCreate(['key' => 'company_email'], ['value' => 'old@test.com', 'type' => 'text', 'group' => 'contact']);

        $response = $this->actingAs($admin)->put('/admin/settings', [
            'settings' => [
                ['key' => 'company_phone', 'value' => '+966111222333'],
                ['key' => 'company_email', 'value' => 'new@test.com'],
            ],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertEquals('+966111222333', Setting::get('company_phone'));
        $this->assertEquals('new@test.com', Setting::get('company_email'));
    }

    public function test_settings_update_detects_no_changes(): void
    {
        $admin = $this->createAdmin();

        Setting::updateOrCreate(['key' => 'company_phone'], ['value' => '+966000', 'type' => 'text', 'group' => 'contact']);

        $response = $this->actingAs($admin)->put('/admin/settings', [
            'settings' => [
                ['key' => 'company_phone', 'value' => '+966000'],
            ],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'No changes detected.');
    }

    // ===============================================================
    // Media CRUD
    // ===============================================================

    public function test_media_upload_stores_file(): void
    {
        Storage::fake('local');
        $admin = $this->createAdmin();

        $countBefore = Media::count();

        $file = UploadedFile::fake()->image('test-photo.jpg', 100, 100);

        $response = $this->actingAs($admin)->post('/admin/media', [
            'file' => $file,
            'folder' => 'general',
            'alt_text_en' => 'Test photo',
        ]);

        $response->assertRedirect();
        $this->assertEquals($countBefore + 1, Media::count());

        $media = Media::orderByDesc('id')->first();
        Storage::disk('local')->assertExists($media->path);
    }

    public function test_media_upload_rejects_invalid_file_type(): void
    {
        Storage::fake('local');
        $admin = $this->createAdmin();

        $countBefore = Media::count();

        $file = UploadedFile::fake()->create('malicious.exe', 100, 'application/x-msdownload');

        $response = $this->actingAs($admin)->post('/admin/media', [
            'file' => $file,
            'folder' => 'general',
        ]);

        $response->assertSessionHasErrors('file');
        $this->assertEquals($countBefore, Media::count());
    }

    public function test_media_upload_rejects_invalid_folder_name(): void
    {
        Storage::fake('local');
        $admin = $this->createAdmin();

        $file = UploadedFile::fake()->image('test.jpg', 100, 100);

        $response = $this->actingAs($admin)->post('/admin/media', [
            'file' => $file,
            'folder' => '../../../etc',
        ]);

        $response->assertSessionHasErrors('folder');
    }

    public function test_media_destroy_soft_deletes(): void
    {
        Storage::fake('local');
        $admin = $this->createAdmin();

        $media = Media::create([
            'filename' => 'test.jpg',
            'original_filename' => 'test.jpg',
            'path' => 'media/general/test.jpg',
            'mime_type' => 'image/jpeg',
            'size' => 1024,
            'folder' => 'general',
        ]);

        Storage::put('media/general/test.jpg', 'content');

        $response = $this->actingAs($admin)->delete("/admin/media/{$media->id}");

        $response->assertRedirect();
        $this->assertSoftDeleted('media', ['id' => $media->id]);
        // File should still exist after soft delete
        Storage::disk('local')->assertExists('media/general/test.jpg');
    }

    // ===============================================================
    // Career Applications — Admin Actions
    // ===============================================================

    public function test_career_application_status_update(): void
    {
        $admin = $this->createAdmin();

        $application = CareerApplication::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '+966501234567',
            'job_title' => 'Engineer',
            'cv_path' => 'cvs/test.pdf',
        ]);

        $response = $this->actingAs($admin)->put("/admin/applications/{$application->id}", [
            'status' => 'shortlisted',
            'admin_notes' => 'Great candidate',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('career_applications', [
            'id' => $application->id,
            'status' => 'shortlisted',
            'admin_notes' => 'Great candidate',
            'reviewed_by' => $admin->id,
        ]);
    }

    public function test_career_application_validates_status(): void
    {
        $admin = $this->createAdmin();

        $application = CareerApplication::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '+966501234567',
            'job_title' => 'Engineer',
            'cv_path' => 'cvs/test.pdf',
        ]);

        $response = $this->actingAs($admin)->put("/admin/applications/{$application->id}", [
            'status' => 'invalid_status',
        ]);

        $response->assertSessionHasErrors('status');
    }

    // ===============================================================
    // Users — Admin Only CRUD
    // ===============================================================

    public function test_users_index_renders_for_admin(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get('/admin/users');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('Admin/Users'));
    }

    public function test_users_index_blocked_for_editor(): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor)->get('/admin/users');

        $response->assertForbidden();
    }

    public function test_admin_can_create_user(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->post('/admin/users', [
            'name' => 'New Editor',
            'email' => 'neweditor@nuorsteel.com',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'role' => 'editor',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'name' => 'New Editor',
            'email' => 'neweditor@nuorsteel.com',
            'role' => 'editor',
        ]);
    }

    public function test_admin_cannot_delete_self(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

        // Should be prevented (either 403 or redirect with error)
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    // ===============================================================
    // Newsletter — Admin Only
    // ===============================================================

    public function test_newsletter_index_renders_for_admin(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get('/admin/newsletter');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('Admin/Newsletter'));
    }

    public function test_newsletter_blocked_for_editor(): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor)->get('/admin/newsletter');

        $response->assertForbidden();
    }

    public function test_newsletter_subscriber_toggle_status(): void
    {
        $admin = $this->createAdmin();

        $subscriber = NewsletterSubscriber::create([
            'email' => 'sub@example.com',
            'source' => 'website',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post("/admin/newsletter/{$subscriber->id}/toggle");

        $response->assertRedirect();
        $this->assertDatabaseHas('newsletter_subscribers', [
            'id' => $subscriber->id,
            'is_active' => false,
        ]);
    }
}

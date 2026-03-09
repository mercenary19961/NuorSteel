<?php

namespace Tests\Unit;

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
use Tests\TestCase;

class ModelTest extends TestCase
{
    use RefreshDatabase;

    // ===============================================================
    // Setting Model
    // ===============================================================

    public function test_setting_get_returns_default_when_key_missing(): void
    {
        $this->assertEquals('default', Setting::get('nonexistent', 'default'));
    }

    public function test_setting_set_creates_and_updates(): void
    {
        Setting::create(['key' => 'test_key', 'value' => 'old', 'type' => 'text', 'group' => 'test']);

        Setting::set('test_key', 'new', null);

        $this->assertEquals('new', Setting::get('test_key'));
    }

    public function test_setting_get_group_returns_grouped_settings(): void
    {
        // Use a unique test group to avoid conflict with seeded data
        Setting::create(['key' => 'test_a', 'value' => '1', 'type' => 'text', 'group' => 'test_group']);
        Setting::create(['key' => 'test_b', 'value' => '2', 'type' => 'text', 'group' => 'test_group']);
        Setting::create(['key' => 'test_c', 'value' => '3', 'type' => 'text', 'group' => 'other_group']);

        $group = Setting::getGroup('test_group');

        $this->assertCount(2, $group);
    }

    // ===============================================================
    // User Model
    // ===============================================================

    public function test_user_is_admin(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $editor = User::factory()->create(['role' => 'editor']);

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->isEditor());
        $this->assertTrue($editor->isEditor());
        $this->assertFalse($editor->isAdmin());
    }

    // ===============================================================
    // ContactSubmission Model
    // ===============================================================

    public function test_contact_submission_scopes(): void
    {
        // Record baseline counts (data migrations may have seeded rows)
        $baseUnread = ContactSubmission::unread()->count();
        $baseRead = ContactSubmission::read()->count();
        $baseArchived = ContactSubmission::archived()->count();
        $baseNotArchived = ContactSubmission::notArchived()->count();
        $baseGeneral = ContactSubmission::requestType('general')->count();

        // is_read and is_archived are NOT in $fillable (security fix),
        // so set them via direct property assignment after creation.
        $unread = ContactSubmission::create([
            'name' => 'Unread', 'email' => 'a@test.com', 'phone' => '123',
            'country' => 'SA', 'request_type' => 'general', 'subject' => 'T', 'message' => 'M',
        ]);
        // Defaults: is_read=false, is_archived=false — no changes needed

        $read = ContactSubmission::create([
            'name' => 'Read', 'email' => 'b@test.com', 'phone' => '123',
            'country' => 'SA', 'request_type' => 'vendor', 'subject' => 'T', 'message' => 'M',
        ]);
        $read->is_read = true;
        $read->save();

        $archived = ContactSubmission::create([
            'name' => 'Archived', 'email' => 'c@test.com', 'phone' => '123',
            'country' => 'SA', 'request_type' => 'general', 'subject' => 'T', 'message' => 'M',
        ]);
        $archived->is_read = true;
        $archived->is_archived = true;
        $archived->save();

        $this->assertEquals($baseUnread + 1, ContactSubmission::unread()->count());
        $this->assertEquals($baseRead + 2, ContactSubmission::read()->count());
        $this->assertEquals($baseArchived + 1, ContactSubmission::archived()->count());
        $this->assertEquals($baseNotArchived + 2, ContactSubmission::notArchived()->count());
        $this->assertEquals($baseGeneral + 2, ContactSubmission::requestType('general')->count());
    }

    public function test_contact_submission_mark_as_read(): void
    {
        $submission = ContactSubmission::create([
            'name' => 'Test', 'email' => 'a@test.com', 'phone' => '123',
            'country' => 'SA', 'request_type' => 'general', 'subject' => 'T', 'message' => 'M',
        ]);

        $user = User::factory()->create();
        $submission->markAsRead($user->id);

        $submission->refresh();
        $this->assertTrue($submission->is_read);
        $this->assertEquals($user->id, $submission->read_by);
    }

    public function test_contact_submission_archive_unarchive(): void
    {
        $submission = ContactSubmission::create([
            'name' => 'Test', 'email' => 'a@test.com', 'phone' => '123',
            'country' => 'SA', 'request_type' => 'general', 'subject' => 'T', 'message' => 'M',
        ]);

        $submission->archive();
        $submission->refresh();
        $this->assertTrue($submission->is_archived);

        $submission->unarchive();
        $submission->refresh();
        $this->assertFalse($submission->is_archived);
    }

    // ===============================================================
    // CareerApplication Model
    // ===============================================================

    public function test_career_application_status_methods(): void
    {
        $user = User::factory()->create();
        $app = CareerApplication::create([
            'name' => 'Jane', 'email' => 'jane@test.com', 'phone' => '123',
            'job_title' => 'Engineer', 'cv_path' => 'cvs/test.pdf',
        ]);

        $app->markAsReviewed($user->id);
        $app->refresh();
        $this->assertEquals('reviewed', $app->status);
        $this->assertEquals($user->id, $app->reviewed_by);

        $app->markAsShortlisted($user->id);
        $app->refresh();
        $this->assertEquals('shortlisted', $app->status);

        $app->markAsRejected($user->id);
        $app->refresh();
        $this->assertEquals('rejected', $app->status);
    }

    public function test_career_application_is_open_application(): void
    {
        $open = CareerApplication::create([
            'name' => 'Open', 'email' => 'o@test.com', 'phone' => '123',
            'job_title' => 'Any', 'cv_path' => 'cvs/test.pdf',
            'career_listing_id' => null,
        ]);

        $listing = CareerListing::create([
            'title_en' => 'Test', 'title_ar' => 'تجربة', 'slug' => 'test',
            'description_en' => 'D', 'description_ar' => 'و', 'status' => 'open',
        ]);

        $linked = CareerApplication::create([
            'name' => 'Linked', 'email' => 'l@test.com', 'phone' => '123',
            'job_title' => 'Test', 'cv_path' => 'cvs/test2.pdf',
            'career_listing_id' => $listing->id,
        ]);

        $this->assertTrue($open->isOpenApplication());
        $this->assertFalse($linked->isOpenApplication());
    }

    // ===============================================================
    // CareerListing Model
    // ===============================================================

    public function test_career_listing_open_scope(): void
    {
        CareerListing::create([
            'title_en' => 'Open Job', 'title_ar' => 'وظيفة مفتوحة', 'slug' => 'open-job',
            'description_en' => 'D', 'description_ar' => 'و', 'status' => 'open',
        ]);
        CareerListing::create([
            'title_en' => 'Closed Job', 'title_ar' => 'وظيفة مغلقة', 'slug' => 'closed-job',
            'description_en' => 'D', 'description_ar' => 'و', 'status' => 'closed',
        ]);

        $this->assertCount(1, CareerListing::open()->get());
    }

    // ===============================================================
    // Certificate Model
    // ===============================================================

    public function test_certificate_active_scope(): void
    {
        Certificate::query()->delete();

        Certificate::create([
            'title_en' => 'Active', 'title_ar' => 'نشط', 'category' => 'quality',
            'file_path' => 'certificates/a.pdf', 'is_active' => true, 'sort_order' => 1,
        ]);
        Certificate::create([
            'title_en' => 'Inactive', 'title_ar' => 'غير نشط', 'category' => 'quality',
            'file_path' => 'certificates/b.pdf', 'is_active' => false, 'sort_order' => 2,
        ]);

        $this->assertCount(1, Certificate::active()->get());
    }

    public function test_certificate_category_scopes(): void
    {
        Certificate::query()->delete();

        Certificate::create([
            'title_en' => 'ESG', 'title_ar' => 'ESG', 'category' => 'esg',
            'file_path' => 'certificates/esg.pdf', 'is_active' => true, 'sort_order' => 1,
        ]);
        Certificate::create([
            'title_en' => 'Quality', 'title_ar' => 'جودة', 'category' => 'quality',
            'file_path' => 'certificates/quality.pdf', 'is_active' => true, 'sort_order' => 2,
        ]);
        Certificate::create([
            'title_en' => 'Gov', 'title_ar' => 'حوكمة', 'category' => 'governance',
            'file_path' => 'certificates/gov.pdf', 'is_active' => true, 'sort_order' => 3,
        ]);

        $this->assertCount(1, Certificate::esg()->get());
        $this->assertCount(1, Certificate::quality()->get());
        $this->assertCount(1, Certificate::governance()->get());
    }

    // ===============================================================
    // LinkedinCache Model
    // ===============================================================

    public function test_linkedin_cache_active_scope(): void
    {
        LinkedinCache::query()->forceDelete();

        LinkedinCache::create([
            'post_id' => 'urn:li:activity:1', 'content' => 'Active',
            'post_url' => 'https://linkedin.com/1', 'is_active' => true, 'sort_order' => 1,
        ]);
        LinkedinCache::create([
            'post_id' => 'urn:li:activity:2', 'content' => 'Hidden',
            'post_url' => 'https://linkedin.com/2', 'is_active' => false, 'sort_order' => 2,
        ]);

        $this->assertCount(1, LinkedinCache::active()->get());
    }

    public function test_linkedin_cache_uses_soft_deletes(): void
    {
        LinkedinCache::query()->forceDelete();

        $post = LinkedinCache::create([
            'post_id' => 'urn:li:activity:3', 'content' => 'Deletable',
            'post_url' => 'https://linkedin.com/3', 'is_active' => true, 'sort_order' => 1,
        ]);

        $post->delete();

        $this->assertSoftDeleted('linkedin_cache', ['id' => $post->id]);
        $this->assertCount(0, LinkedinCache::all());
        $this->assertCount(1, LinkedinCache::withTrashed()->get());
    }

    public function test_linkedin_cache_get_latest_posts(): void
    {
        LinkedinCache::query()->forceDelete();

        for ($i = 1; $i <= 7; $i++) {
            LinkedinCache::create([
                'post_id' => "urn:li:activity:{$i}",
                'content' => "Post {$i}",
                'post_url' => "https://linkedin.com/{$i}",
                'is_active' => $i <= 6,
                'sort_order' => $i,
                'posted_at' => now()->subDays(7 - $i),
            ]);
        }

        $latest = LinkedinCache::getLatestPosts(5);

        $this->assertCount(5, $latest);
        // Should only contain active posts
        foreach ($latest as $post) {
            $this->assertTrue($post->is_active);
        }
    }

    // ===============================================================
    // Media Model
    // ===============================================================

    public function test_media_is_image_and_is_pdf(): void
    {
        $image = new Media(['mime_type' => 'image/jpeg']);
        $pdf = new Media(['mime_type' => 'application/pdf']);
        $other = new Media(['mime_type' => 'text/html']);

        $this->assertTrue($image->isImage());
        $this->assertFalse($image->isPdf());
        $this->assertTrue($pdf->isPdf());
        $this->assertFalse($pdf->isImage());
        $this->assertFalse($other->isImage());
        $this->assertFalse($other->isPdf());
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private function createAdmin(): User
    {
        return User::factory()->create([
            'role' => 'admin',
            'is_active' => true,
        ]);
    }

    private function createEditor(): User
    {
        return User::factory()->create([
            'role' => 'editor',
            'is_active' => true,
        ]);
    }

    // ---------------------------------------------------------------
    // Data Providers
    // ---------------------------------------------------------------

    /**
     * Routes that require authentication but are accessible to both admins and editors.
     */
    public static function sharedAdminRoutesProvider(): array
    {
        return [
            'dashboard'    => ['/admin'],
            'content'      => ['/admin/content'],
            'timeline'     => ['/admin/timeline'],
            'media'        => ['/admin/media'],
            'products'     => ['/admin/products'],
            'certificates' => ['/admin/certificates'],
            'careers'      => ['/admin/careers'],
            'applications' => ['/admin/applications'],
            'contacts'     => ['/admin/contacts'],
        ];
    }

    /**
     * Routes that require admin role (editors are blocked).
     */
    public static function adminOnlyRoutesProvider(): array
    {
        return [
            'newsletter' => ['/admin/newsletter'],
            'settings'   => ['/admin/settings'],
            'users'      => ['/admin/users'],
        ];
    }

    /**
     * All admin routes combined (shared + admin-only).
     */
    public static function allAdminRoutesProvider(): array
    {
        return array_merge(
            static::sharedAdminRoutesProvider(),
            static::adminOnlyRoutesProvider(),
        );
    }

    // ---------------------------------------------------------------
    // 1. Unauthenticated users are redirected to login
    // ---------------------------------------------------------------

    #[DataProvider('allAdminRoutesProvider')]
    public function test_unauthenticated_user_is_redirected_from_admin_pages(string $url): void
    {
        $response = $this->get($url);

        $response->assertRedirect('/admin/login');
    }

    // ---------------------------------------------------------------
    // 2 & 3. Both admin and editor can access the dashboard
    // ---------------------------------------------------------------

    public function test_admin_can_access_dashboard(): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) =>
            $page->component('Admin/Dashboard')
        );
    }

    public function test_editor_can_access_dashboard(): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor)->get('/admin');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) =>
            $page->component('Admin/Dashboard')
        );
    }

    // ---------------------------------------------------------------
    // 4. Admin can access all shared admin pages
    // ---------------------------------------------------------------

    #[DataProvider('sharedAdminRoutesProvider')]
    public function test_admin_can_access_shared_admin_pages(string $url): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get($url);

        $response->assertOk();
    }

    // ---------------------------------------------------------------
    // 5. Editor can access shared content-management pages
    // ---------------------------------------------------------------

    #[DataProvider('sharedAdminRoutesProvider')]
    public function test_editor_can_access_shared_admin_pages(string $url): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor)->get($url);

        $response->assertOk();
    }

    // ---------------------------------------------------------------
    // 6. Admin can access admin-only pages
    // ---------------------------------------------------------------

    #[DataProvider('adminOnlyRoutesProvider')]
    public function test_admin_can_access_admin_only_pages(string $url): void
    {
        $admin = $this->createAdmin();

        $response = $this->actingAs($admin)->get($url);

        $response->assertOk();
    }

    // ---------------------------------------------------------------
    // 7, 8, 9. Editor CANNOT access admin-only pages (403)
    // ---------------------------------------------------------------

    #[DataProvider('adminOnlyRoutesProvider')]
    public function test_editor_cannot_access_admin_only_pages(string $url): void
    {
        $editor = $this->createEditor();

        $response = $this->actingAs($editor)->get($url);

        $response->assertForbidden();
    }
}

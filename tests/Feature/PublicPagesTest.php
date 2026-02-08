<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    // ---------------------------------------------------------------
    // Home
    // ---------------------------------------------------------------

    public function test_home_page_loads_successfully(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_home_page_renders_correct_inertia_component(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn (Assert $page) => $page->component('Public/Home'));
    }

    public function test_home_page_has_featured_products_prop(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->has('featured_products')
        );
    }

    public function test_home_page_has_linkedin_posts_prop(): void
    {
        $response = $this->get('/');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->has('linkedin_posts')
        );
    }

    // ---------------------------------------------------------------
    // About
    // ---------------------------------------------------------------

    public function test_about_page_loads_successfully(): void
    {
        $response = $this->get('/about');

        $response->assertStatus(200);
    }

    public function test_about_page_renders_correct_inertia_component(): void
    {
        $response = $this->get('/about');

        $response->assertInertia(fn (Assert $page) => $page->component('Public/About'));
    }

    // ---------------------------------------------------------------
    // Recycling
    // ---------------------------------------------------------------

    public function test_recycling_page_loads_successfully(): void
    {
        $response = $this->get('/about/recycling');

        $response->assertStatus(200);
    }

    public function test_recycling_page_renders_correct_inertia_component(): void
    {
        $response = $this->get('/about/recycling');

        $response->assertInertia(fn (Assert $page) => $page->component('Public/Recycling'));
    }

    // ---------------------------------------------------------------
    // Products
    // ---------------------------------------------------------------

    public function test_products_page_loads_successfully(): void
    {
        $response = $this->get('/products');

        $response->assertStatus(200);
    }

    public function test_products_page_renders_correct_inertia_component(): void
    {
        $response = $this->get('/products');

        $response->assertInertia(fn (Assert $page) => $page->component('Public/Products'));
    }

    public function test_products_page_has_products_prop(): void
    {
        $response = $this->get('/products');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Products')
            ->has('products')
        );
    }

    // ---------------------------------------------------------------
    // Quality
    // ---------------------------------------------------------------

    public function test_quality_page_loads_successfully(): void
    {
        $response = $this->get('/quality');

        $response->assertStatus(200);
    }

    public function test_quality_page_renders_correct_inertia_component(): void
    {
        $response = $this->get('/quality');

        $response->assertInertia(fn (Assert $page) => $page->component('Public/Quality'));
    }

    // ---------------------------------------------------------------
    // Career
    // ---------------------------------------------------------------

    public function test_career_page_loads_successfully(): void
    {
        $response = $this->get('/career');

        $response->assertStatus(200);
    }

    public function test_career_page_renders_correct_inertia_component(): void
    {
        $response = $this->get('/career');

        $response->assertInertia(fn (Assert $page) => $page->component('Public/Career'));
    }

    public function test_career_page_has_listings_prop(): void
    {
        $response = $this->get('/career');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Career')
            ->has('listings')
        );
    }

    // ---------------------------------------------------------------
    // Certificates
    // ---------------------------------------------------------------

    public function test_certificates_page_loads_successfully(): void
    {
        $response = $this->get('/certificates');

        $response->assertStatus(200);
    }

    public function test_certificates_page_renders_correct_inertia_component(): void
    {
        $response = $this->get('/certificates');

        $response->assertInertia(fn (Assert $page) => $page->component('Public/Certificates'));
    }

    public function test_certificates_page_has_certificate_props(): void
    {
        $response = $this->get('/certificates');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Public/Certificates')
            ->has('esg')
            ->has('quality')
            ->has('governance')
        );
    }

    // ---------------------------------------------------------------
    // Contact
    // ---------------------------------------------------------------

    public function test_contact_page_loads_successfully(): void
    {
        $response = $this->get('/contact');

        $response->assertStatus(200);
    }

    public function test_contact_page_renders_correct_inertia_component(): void
    {
        $response = $this->get('/contact');

        $response->assertInertia(fn (Assert $page) => $page->component('Public/Contact'));
    }
}

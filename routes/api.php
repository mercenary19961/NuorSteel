<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CareerController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\SettingController;
use App\Http\Controllers\Api\Admin\SiteContentController;
use App\Http\Controllers\Api\Admin\MediaController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\CertificateController;
use App\Http\Controllers\Api\Admin\TimelineController;
use App\Http\Controllers\Api\Admin\CareerController as AdminCareerController;
use App\Http\Controllers\Api\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Api\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Api\Admin\UserController;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware('locale')->group(function () {

    // Authentication (rate limited: 5 attempts per minute)
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // Public Pages
    Route::get('/pages/home', [PageController::class, 'home']);
    Route::get('/pages/about', [PageController::class, 'about']);
    Route::get('/pages/recycling', [PageController::class, 'recycling']);
    Route::get('/pages/quality', [PageController::class, 'quality']);
    Route::get('/pages/certificates', [PageController::class, 'certificates']);
    Route::get('/pages/contact', [PageController::class, 'contact']);
    Route::get('/settings', [PageController::class, 'settings']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    // Careers
    Route::get('/careers', [CareerController::class, 'index']);
    Route::get('/careers/{slug}', [CareerController::class, 'show']);
    Route::post('/careers/apply', [CareerController::class, 'apply']);
    Route::post('/careers/{slug}/apply', [CareerController::class, 'apply']);

    // Contact
    Route::post('/contact', [ContactController::class, 'submit']);

    // Newsletter
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
    Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);

    /*
    |--------------------------------------------------------------------------
    | Protected Routes (Authenticated)
    |--------------------------------------------------------------------------
    */

    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/user', [AuthController::class, 'user']);

        /*
        |--------------------------------------------------------------------------
        | Admin Routes
        |--------------------------------------------------------------------------
        */

        Route::prefix('admin')->group(function () {

            // Dashboard
            Route::get('/dashboard', [DashboardController::class, 'index']);

            // Site Content
            Route::get('/content', [SiteContentController::class, 'index']);
            Route::get('/content/{page}', [SiteContentController::class, 'show']);
            Route::put('/content/{id}', [SiteContentController::class, 'update']);
            Route::put('/content', [SiteContentController::class, 'bulkUpdate']);

            // Media
            Route::get('/media', [MediaController::class, 'index']);
            Route::post('/media', [MediaController::class, 'store']);
            Route::get('/media/folders', [MediaController::class, 'folders']);
            Route::get('/media/{id}', [MediaController::class, 'show']);
            Route::put('/media/{id}', [MediaController::class, 'update']);
            Route::delete('/media/{id}', [MediaController::class, 'destroy']);

            // Products
            Route::get('/products', [AdminProductController::class, 'index']);
            Route::post('/products', [AdminProductController::class, 'store']);
            Route::get('/products/categories', [AdminProductController::class, 'categories']);
            Route::get('/products/{id}', [AdminProductController::class, 'show']);
            Route::put('/products/{id}', [AdminProductController::class, 'update']);
            Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);
            Route::post('/products/{id}/images', [AdminProductController::class, 'addImage']);
            Route::delete('/products/{id}/images/{imageId}', [AdminProductController::class, 'removeImage']);
            Route::put('/products/{id}/specifications', [AdminProductController::class, 'updateSpecifications']);

            // Certificates
            Route::get('/certificates', [CertificateController::class, 'index']);
            Route::post('/certificates', [CertificateController::class, 'store']);
            Route::get('/certificates/{id}', [CertificateController::class, 'show']);
            Route::put('/certificates/{id}', [CertificateController::class, 'update']);
            Route::delete('/certificates/{id}', [CertificateController::class, 'destroy']);

            // Timeline
            Route::get('/timeline', [TimelineController::class, 'index']);
            Route::post('/timeline', [TimelineController::class, 'store']);
            Route::get('/timeline/{id}', [TimelineController::class, 'show']);
            Route::put('/timeline/{id}', [TimelineController::class, 'update']);
            Route::delete('/timeline/{id}', [TimelineController::class, 'destroy']);
            Route::post('/timeline/reorder', [TimelineController::class, 'reorder']);

            // Career Listings
            Route::get('/careers', [AdminCareerController::class, 'index']);
            Route::post('/careers', [AdminCareerController::class, 'store']);
            Route::get('/careers/{id}', [AdminCareerController::class, 'show']);
            Route::put('/careers/{id}', [AdminCareerController::class, 'update']);
            Route::delete('/careers/{id}', [AdminCareerController::class, 'destroy']);

            // Career Applications
            Route::get('/applications', [AdminCareerController::class, 'applications']);
            Route::get('/applications/{id}', [AdminCareerController::class, 'showApplication']);
            Route::put('/applications/{id}', [AdminCareerController::class, 'updateApplication']);
            Route::get('/applications/{id}/cv', [AdminCareerController::class, 'downloadCv']);
            Route::delete('/applications/{id}', [AdminCareerController::class, 'deleteApplication']);

            // Contact Submissions
            Route::get('/contacts', [AdminContactController::class, 'index']);
            Route::get('/contacts/stats', [AdminContactController::class, 'stats']);
            Route::get('/contacts/{id}', [AdminContactController::class, 'show']);
            Route::post('/contacts/{id}/read', [AdminContactController::class, 'markAsRead']);
            Route::post('/contacts/{id}/archive', [AdminContactController::class, 'archive']);
            Route::post('/contacts/{id}/unarchive', [AdminContactController::class, 'unarchive']);
            Route::get('/contacts/{id}/file', [AdminContactController::class, 'downloadFile']);
            Route::delete('/contacts/{id}', [AdminContactController::class, 'destroy']);

            // Newsletter
            Route::get('/newsletter', [AdminNewsletterController::class, 'index']);
            Route::post('/newsletter', [AdminNewsletterController::class, 'store']);
            Route::get('/newsletter/stats', [AdminNewsletterController::class, 'stats']);
            Route::get('/newsletter/export', [AdminNewsletterController::class, 'export']);
            Route::delete('/newsletter/{id}', [AdminNewsletterController::class, 'destroy']);
            Route::post('/newsletter/{id}/toggle', [AdminNewsletterController::class, 'toggleStatus']);

            // Settings (Admin only)
            Route::middleware('admin')->group(function () {
                Route::get('/settings', [SettingController::class, 'index']);
                Route::put('/settings', [SettingController::class, 'update']);
                Route::get('/settings/{key}', [SettingController::class, 'show']);

                // Users (Admin only)
                Route::get('/users', [UserController::class, 'index']);
                Route::post('/users', [UserController::class, 'store']);
                Route::get('/users/{id}', [UserController::class, 'show']);
                Route::put('/users/{id}', [UserController::class, 'update']);
                Route::delete('/users/{id}', [UserController::class, 'destroy']);
                Route::post('/users/{id}/toggle', [UserController::class, 'toggleStatus']);
            });
        });
    });
});

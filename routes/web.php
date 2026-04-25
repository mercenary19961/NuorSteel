<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\ProductController;
use App\Http\Controllers\Public\QualityController;
use App\Http\Controllers\Public\SustainabilityController;
// use App\Http\Controllers\Public\CertificateController; // Certificates page hidden — re-enable when client wants it public
use App\Http\Controllers\Public\CareerController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\NewsletterController;
use App\Http\Controllers\Public\LocaleController;
use App\Http\Controllers\MediaServeController;
use App\Http\Controllers\Auth\AdminInviteController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\SiteContentController as AdminContentController;
use App\Http\Controllers\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CertificateController as AdminCertificateController;
use App\Http\Controllers\Admin\CareerController as AdminCareerController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\NewsletterController as AdminNewsletterController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\UndoController as AdminUndoController;
use App\Http\Controllers\Admin\ChangeLogController as AdminChangeLogController;
use App\Http\Controllers\Admin\LinkedinPostController as AdminLinkedinPostController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/quality', [QualityController::class, 'index'])->name('quality');
Route::get('/sustainability', [SustainabilityController::class, 'index'])->name('sustainability');
Route::get('/career', [CareerController::class, 'index'])->name('career.index');
Route::get('/career/{slug}', [CareerController::class, 'show'])->name('career.show');
// Certificates page hidden — admin panel still manages the data at /admin/certificates,
// but the public route + file-serving endpoint are disabled so direct-URL access 404s.
// Re-enable by uncommenting + restoring the CertificateController use above.
// Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates');
// Route::get('/certificates/{id}/file', [CertificateController::class, 'viewFile'])->name('certificates.view-file')->where('id', '[0-9]+');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');

// Form submissions (rate limited)
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store')->middleware('throttle:5,10');
Route::post('/career/apply', [CareerController::class, 'apply'])->name('career.apply')->middleware('throttle:5,10');
Route::post('/career/{slug}/apply', [CareerController::class, 'apply'])->name('career.apply-job')->middleware('throttle:5,10');
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe')->middleware('throttle:5,10');

// Media serve (public access to uploaded files)
Route::get('/media/{id}', [MediaServeController::class, 'show'])->name('media.serve')->where('id', '[0-9]+');

// Locale switch
Route::post('/locale/{locale}', [LocaleController::class, 'switch'])->name('locale.switch')->middleware('throttle:30,1');

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [LoginController::class, 'showLoginForm'])->name('login')->middleware('throttle:5,1');
    Route::post('/admin/login', [LoginController::class, 'login'])->middleware('throttle:5,1');

    Route::get('/forgot-password', [PasswordResetController::class, 'showLinkRequestForm'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->name('password.email')->middleware('throttle:5,15');
    Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [PasswordResetController::class, 'reset'])->name('password.update')->middleware('throttle:5,15');

    // Invite acceptance — signed URLs from AdminInviteEmail. The 'signed' middleware
    // verifies signature + expiry; an expired or tampered link 403s.
    Route::get('/admin/invite/{user}/accept', [AdminInviteController::class, 'showAcceptForm'])
        ->name('admin.invite.accept')
        ->middleware('signed');
    Route::post('/admin/invite/{user}/accept', [AdminInviteController::class, 'accept'])
        ->name('admin.invite.accept.post')
        ->middleware(['signed', 'throttle:5,15']);
});

Route::post('/admin/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

/*
|--------------------------------------------------------------------------
| Admin Routes (Auth Required)
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Content
    Route::get('/content', [AdminContentController::class, 'index'])->name('content.index');
    Route::put('/content/{id}', [AdminContentController::class, 'update'])->name('content.update');
    Route::put('/content', [AdminContentController::class, 'bulkUpdate'])->name('content.bulk-update');

    // Undo (reusable across all admin sections)
    Route::get('/undo/{model}/{id}', [AdminUndoController::class, 'status'])->name('undo.status');
    Route::post('/undo/{model}/{id}', [AdminUndoController::class, 'restore'])->name('undo.restore');
    Route::delete('/undo/{model}/{id}', [AdminUndoController::class, 'clear'])->name('undo.clear');

    // Media
    Route::get('/media', [AdminMediaController::class, 'index'])->name('media.index');
    Route::get('/media/json', [AdminMediaController::class, 'jsonIndex'])->name('media.json');
    Route::post('/media/json', [AdminMediaController::class, 'storeJson'])->name('media.store-json');
    Route::post('/media', [AdminMediaController::class, 'store'])->name('media.store');
    Route::post('/media/folders', [AdminMediaController::class, 'createFolder'])->name('media.create-folder');
    Route::put('/media/folders', [AdminMediaController::class, 'renameFolder'])->name('media.rename-folder');
    Route::delete('/media/folders', [AdminMediaController::class, 'deleteFolder'])->name('media.delete-folder');
    Route::put('/media/{id}', [AdminMediaController::class, 'update'])->name('media.update');
    Route::delete('/media/{id}', [AdminMediaController::class, 'destroy'])->name('media.destroy');

    // Products
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::get('/products/{id}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{id}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{id}', [AdminProductController::class, 'destroy'])->name('products.destroy');
    Route::post('/products/{id}/images', [AdminProductController::class, 'addImage'])->name('products.add-image');
    Route::delete('/products/{id}/images/{imageId}', [AdminProductController::class, 'removeImage'])->name('products.remove-image');
    Route::put('/products/{id}/specifications', [AdminProductController::class, 'updateSpecifications'])->name('products.update-specs');

    // Certificates
    Route::get('/certificates', [AdminCertificateController::class, 'index'])->name('certificates.index');
    Route::get('/certificates/create', [AdminCertificateController::class, 'create'])->name('certificates.create');
    Route::post('/certificates', [AdminCertificateController::class, 'store'])->name('certificates.store');
    Route::get('/certificates/{id}/edit', [AdminCertificateController::class, 'edit'])->name('certificates.edit');
    Route::post('/certificates/{id}', [AdminCertificateController::class, 'update'])->name('certificates.update');
    Route::delete('/certificates/{id}', [AdminCertificateController::class, 'destroy'])->name('certificates.destroy');
    Route::get('/certificates/{id}/file', [AdminCertificateController::class, 'viewFile'])->name('certificates.view-file');

    // Careers
    Route::get('/careers', [AdminCareerController::class, 'index'])->name('careers.index');
    Route::get('/careers/create', [AdminCareerController::class, 'create'])->name('careers.create');
    Route::post('/careers', [AdminCareerController::class, 'store'])->name('careers.store');
    Route::get('/careers/{id}', [AdminCareerController::class, 'show'])->name('careers.show');
    Route::get('/careers/{id}/edit', [AdminCareerController::class, 'edit'])->name('careers.edit');
    Route::put('/careers/{id}', [AdminCareerController::class, 'update'])->name('careers.update');
    Route::delete('/careers/{id}', [AdminCareerController::class, 'destroy'])->name('careers.destroy');

    // Applications
    Route::get('/applications', [AdminCareerController::class, 'applications'])->name('applications.index');
    Route::put('/applications/{id}', [AdminCareerController::class, 'updateApplication'])->name('applications.update');
    Route::post('/applications/{id}/viewed', [AdminCareerController::class, 'markApplicationViewed'])->name('applications.viewed');
    Route::get('/applications/{id}/cv', [AdminCareerController::class, 'downloadCv'])->name('applications.download-cv');
    Route::delete('/applications/{id}', [AdminCareerController::class, 'deleteApplication'])->name('applications.destroy');

    // LinkedIn Posts
    Route::get('/linkedin-posts', [AdminLinkedinPostController::class, 'index'])->name('linkedin-posts.index');
    Route::post('/linkedin-posts', [AdminLinkedinPostController::class, 'store'])->name('linkedin-posts.store');
    Route::put('/linkedin-posts/{id}', [AdminLinkedinPostController::class, 'update'])->name('linkedin-posts.update');
    Route::delete('/linkedin-posts/{id}', [AdminLinkedinPostController::class, 'destroy'])->name('linkedin-posts.destroy');
    Route::post('/linkedin-posts/{id}/toggle', [AdminLinkedinPostController::class, 'toggleVisibility'])->name('linkedin-posts.toggle');
    Route::post('/linkedin-posts/reorder', [AdminLinkedinPostController::class, 'reorder'])->name('linkedin-posts.reorder');

    // Partners
    Route::get('/partners', [AdminPartnerController::class, 'index'])->name('partners.index');
    Route::post('/partners', [AdminPartnerController::class, 'store'])->name('partners.store');
    Route::put('/partners/{id}', [AdminPartnerController::class, 'update'])->name('partners.update');
    Route::delete('/partners/{id}', [AdminPartnerController::class, 'destroy'])->name('partners.destroy');
    Route::post('/partners/reorder', [AdminPartnerController::class, 'reorder'])->name('partners.reorder');

    // Contacts
    Route::get('/contacts', [AdminContactController::class, 'index'])->name('contacts.index');
    Route::post('/contacts/{id}/read', [AdminContactController::class, 'markAsRead'])->name('contacts.read');
    Route::post('/contacts/{id}/archive', [AdminContactController::class, 'archive'])->name('contacts.archive');
    Route::post('/contacts/{id}/unarchive', [AdminContactController::class, 'unarchive'])->name('contacts.unarchive');
    Route::get('/contacts/{id}/file', [AdminContactController::class, 'downloadFile'])->name('contacts.download-file');
    Route::delete('/contacts/{id}', [AdminContactController::class, 'destroy'])->name('contacts.destroy');

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Newsletter
        Route::get('/newsletter', [AdminNewsletterController::class, 'index'])->name('newsletter.index');
        Route::post('/newsletter', [AdminNewsletterController::class, 'store'])->name('newsletter.store');
        Route::delete('/newsletter/{id}', [AdminNewsletterController::class, 'destroy'])->name('newsletter.destroy');
        Route::post('/newsletter/{id}/toggle', [AdminNewsletterController::class, 'toggleStatus'])->name('newsletter.toggle');
        Route::get('/newsletter/export', [AdminNewsletterController::class, 'export'])->name('newsletter.export');

        // Settings
        Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

        // Users
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('/users/{id}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{id}/toggle', [AdminUserController::class, 'toggleStatus'])->name('users.toggle');
        Route::post('/users/{id}/resend-invite', [AdminUserController::class, 'resendInvite'])->name('users.resend-invite');

        // Change Log
        Route::get('/change-log', [AdminChangeLogController::class, 'index'])->name('change-log.index');
        Route::post('/change-log/{id}/revert', [AdminChangeLogController::class, 'revert'])->name('change-log.revert');
        Route::delete('/change-log/{id}', [AdminChangeLogController::class, 'destroy'])->name('change-log.destroy');
    });
});

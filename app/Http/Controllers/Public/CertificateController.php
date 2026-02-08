<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\Certificate;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(): Response
    {
        $locale = session('locale', 'en');

        return Inertia::render('Public/Certificates', [
            'content' => SiteContent::getPage('certificates', $locale),
            'esg' => Certificate::active()
                ->esg()
                ->ordered()
                ->with('thumbnail')
                ->get()
                ->map(fn($c) => $this->formatCertificate($c)),
            'quality' => Certificate::active()
                ->quality()
                ->ordered()
                ->with('thumbnail')
                ->get()
                ->map(fn($c) => $this->formatCertificate($c)),
            'governance' => Certificate::active()
                ->governance()
                ->ordered()
                ->with('thumbnail')
                ->get()
                ->map(fn($c) => $this->formatCertificate($c)),
        ]);
    }

    private function formatCertificate(Certificate $certificate): array
    {
        return [
            'id' => $certificate->id,
            'title' => $certificate->title,
            'description' => $certificate->description,
            'file_url' => $certificate->file_url,
            'thumbnail' => $certificate->thumbnail?->url,
            'issue_date' => $certificate->issue_date?->format('Y-m-d'),
            'expiry_date' => $certificate->expiry_date?->format('Y-m-d'),
        ];
    }
}

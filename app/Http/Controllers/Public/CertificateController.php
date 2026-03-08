<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use App\Models\Certificate;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CertificateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Public/Certificates', [
            'content_en' => SiteContent::getPage('certificates', 'en'),
            'content_ar' => SiteContent::getPage('certificates', 'ar'),
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

    public function viewFile(int $id): StreamedResponse
    {
        $certificate = Certificate::active()->findOrFail($id);

        // Prefer media path, fallback to legacy file_path
        $path = $certificate->file_media_id
            ? Media::findOrFail($certificate->file_media_id)->path
            : $certificate->file_path;

        if (!Storage::exists($path)) {
            throw new NotFoundHttpException();
        }

        return Storage::response($path, $certificate->title_en . '.pdf', [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $certificate->title_en . '.pdf"',
        ]);
    }

    private function formatCertificate(Certificate $certificate): array
    {
        return [
            'id' => $certificate->id,
            'title_en' => $certificate->title_en,
            'title_ar' => $certificate->title_ar,
            'description_en' => $certificate->description_en,
            'description_ar' => $certificate->description_ar,
            'file_url' => route('certificates.view-file', $certificate->id),
            'thumbnail' => $certificate->thumbnail?->url,
            'issue_date' => $certificate->issue_date?->format('Y-m-d'),
            'expiry_date' => $certificate->expiry_date?->format('Y-m-d'),
        ];
    }
}

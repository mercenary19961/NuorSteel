<?php

namespace Database\Seeders;

use App\Models\CareerApplication;
use App\Models\CareerListing;
use App\Models\Certificate;
use App\Models\ContactSubmission;
use App\Models\Media;
use App\Models\NewsletterSubscriber;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DemoContentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@nuorsteel.com')->first();
        $adminId = $admin?->id;

        // --- Media (product images from public assets) ---
        // Clean up old product media entries
        Media::where('folder', 'products')->forceDelete();

        $mediaItems = [];
        $images = [
            ['source' => 'products/tmt-bars-desktop.png', 'original_filename' => 'tmt-bars.png', 'mime' => 'image/png', 'alt_text_en' => 'TMT reinforcement steel bars', 'alt_text_ar' => 'حديد التسليح', 'folder' => 'products'],
            ['source' => 'products/billets-desktop.png', 'original_filename' => 'billets.png', 'mime' => 'image/png', 'alt_text_en' => 'Steel billets', 'alt_text_ar' => 'ستيل بِليت', 'folder' => 'products'],
        ];

        Storage::makeDirectory('media');

        foreach ($images as $img) {
            $sourcePath = public_path('images/' . $img['source']);
            $filename = Str::random(20) . '.png';
            $storagePath = 'media/' . $filename;

            Storage::put($storagePath, file_get_contents($sourcePath));

            $mediaItems[] = Media::create([
                'filename' => $filename,
                'original_filename' => $img['original_filename'],
                'path' => $storagePath,
                'mime_type' => $img['mime'],
                'size' => filesize($sourcePath),
                'alt_text_en' => $img['alt_text_en'],
                'alt_text_ar' => $img['alt_text_ar'],
                'folder' => $img['folder'],
                'uploaded_by' => $adminId,
            ]);
        }

        // --- Certificate PDFs in media library ---
        // Clean up old certificate media entries
        Media::where('folder', 'certificates')->forceDelete();
        $certificateFiles = [
            ['file' => 'saudi-made-certificate.pdf', 'alt_en' => 'Saudi Made Certificate', 'alt_ar' => 'شهادة صنع في السعودية'],
            ['file' => 'iso-9001-certificate.pdf', 'alt_en' => 'ISO 9001 Certificate', 'alt_ar' => 'شهادة ISO 9001'],
            ['file' => 'nuor-steel-rebar-hpd.pdf', 'alt_en' => 'HPD Certificate', 'alt_ar' => 'شهادة HPD'],
            ['file' => 'nuor-steel-duns-certification.pdf', 'alt_en' => 'DUNS Certification', 'alt_ar' => 'شهادة DUNS'],
            ['file' => 'ncec-2026.pdf', 'alt_en' => 'NCEC 2026 Certificate', 'alt_ar' => 'شهادة NCEC 2026'],
            ['file' => 'epd-hub-3476.pdf', 'alt_en' => 'EPD Certificate', 'alt_ar' => 'شهادة EPD'],
            ['file' => 'iso-45001-certificate.pdf', 'alt_en' => 'ISO 45001 Certificate', 'alt_ar' => 'شهادة ISO 45001'],
            ['file' => 'iso-14001-certificate.pdf', 'alt_en' => 'ISO 14001 Certificate', 'alt_ar' => 'شهادة ISO 14001'],
            ['file' => 'aramco-registration-letter.pdf', 'alt_en' => 'Aramco Registration Letter', 'alt_ar' => 'خطاب تسجيل أرامكو'],
        ];

        foreach ($certificateFiles as $cert) {
            $sourcePath = storage_path('app/private/certificates/' . $cert['file']);
            if (file_exists($sourcePath)) {
                $filename = Str::random(20) . '.pdf';
                $storagePath = 'media/' . $filename;

                Storage::put($storagePath, file_get_contents($sourcePath));

                $mediaRecord = Media::create([
                    'filename' => $filename,
                    'original_filename' => $cert['file'],
                    'path' => $storagePath,
                    'mime_type' => 'application/pdf',
                    'size' => filesize($sourcePath),
                    'alt_text_en' => $cert['alt_en'],
                    'alt_text_ar' => $cert['alt_ar'],
                    'folder' => 'certificates',
                    'uploaded_by' => $adminId,
                ]);

                // Link media to certificate record
                Certificate::where('file_path', 'certificates/' . $cert['file'])
                    ->update(['file_media_id' => $mediaRecord->id]);
            }
        }

        // --- Products (2) ---
        Product::updateOrCreate(['slug' => 'tmt-bars'], [
            'name_en' => 'TMT Bars',
            'name_ar' => 'حديد التسليح',
            'short_description_en' => 'Thermo-Mechanically Treated reinforcement steel bars for concrete construction.',
            'short_description_ar' => 'قضبان حديد تسليح معالجة حرارياً وميكانيكياً للبناء الخرساني.',
            'description_en' => 'Our TMT Bars are manufactured using advanced Thermo-Mechanical Treatment technology, ensuring superior strength, ductility, and weldability. Compliant with SASO and international standards (BS 4449:2005, Grade B500B), available in sizes from 8mm to 32mm diameter. Ideal for residential, commercial, and infrastructure projects across the Kingdom.',
            'description_ar' => 'يتم تصنيع قضبان التسليح لدينا باستخدام تقنية المعالجة الحرارية الميكانيكية المتقدمة، مما يضمن قوة فائقة ومرونة وقابلية للحام. متوافقة مع معايير ساسو والمعايير الدولية (BS 4449:2005, Grade B500B)، متوفرة بأقطار من 8 مم إلى 32 مم. مثالية للمشاريع السكنية والتجارية والبنية التحتية في جميع أنحاء المملكة.',
            'category' => 'tmt-bars',
            'featured_image_id' => $mediaItems[0]->id,
            'is_active' => true,
            'is_featured' => true,
            'sort_order' => 0,
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        Product::updateOrCreate(['slug' => 'billets'], [
            'name_en' => 'Billets',
            'name_ar' => 'ستيل بِليت',
            'short_description_en' => 'High-quality steel billets. The essential semi-finished material for rolling mills.',
            'short_description_ar' => 'كتل صلب عالية الجودة. المادة نصف المصنعة الأساسية لمصانع الدرفلة.',
            'description_en' => 'Nuor Steel produces premium steel billets through Electric Arc Furnace (EAF) steelmaking and continuous casting. Our billets serve as the primary feedstock for TMT bar production and are also available for sale to external rolling mills. Produced to strict chemical and dimensional specifications, ensuring consistent quality downstream.',
            'description_ar' => 'تنتج شركة نور للحديد كتل صلب عالية الجودة من خلال صناعة الصلب بفرن القوس الكهربائي والصب المستمر. تعد ستيل بِليت لدينا المادة الخام الأساسية لإنتاج قضبان التسليح، كما أنها متاحة للبيع لمصانع الدرفلة الخارجية. يتم إنتاجها وفق مواصفات كيميائية وأبعاد صارمة لضمان جودة متسقة.',
            'category' => 'billets',
            'featured_image_id' => $mediaItems[1]->id,
            'is_active' => true,
            'is_featured' => true,
            'sort_order' => 1,
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        // --- Career Listings (2) ---
        $listing1 = CareerListing::updateOrCreate(['slug' => 'mechanical-engineer'], [
            'title_en' => 'Mechanical Engineer',
            'title_ar' => 'مهندس ميكانيكي',
            'description_en' => 'We are looking for an experienced Mechanical Engineer to join our production team. You will be responsible for maintaining and optimizing our steel manufacturing equipment.',
            'description_ar' => 'نبحث عن مهندس ميكانيكي ذو خبرة للانضمام إلى فريق الإنتاج. ستكون مسؤولاً عن صيانة وتحسين معدات تصنيع الحديد.',
            'requirements_en' => "Bachelor's degree in Mechanical Engineering\n5+ years of experience in industrial manufacturing\nKnowledge of steel production processes\nStrong problem-solving skills\nFluent in English; Arabic is a plus",
            'requirements_ar' => "بكالوريوس في الهندسة الميكانيكية\n5+ سنوات خبرة في التصنيع الصناعي\nمعرفة بعمليات إنتاج الحديد\nمهارات قوية في حل المشكلات\nإجادة اللغة الإنجليزية؛ العربية ميزة إضافية",
            'location' => 'Riyadh, Saudi Arabia',
            'employment_type' => 'full-time',
            'status' => 'open',
            'expires_at' => now()->addMonths(2),
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        $listing2 = CareerListing::updateOrCreate(['slug' => 'quality-control-inspector'], [
            'title_en' => 'Quality Control Inspector',
            'title_ar' => 'مفتش مراقبة الجودة',
            'description_en' => 'Join our quality assurance team to ensure all products meet SASO standards and customer specifications. Perform inspections and testing on finished steel products.',
            'description_ar' => 'انضم إلى فريق ضمان الجودة لضمان توافق جميع المنتجات مع معايير ساسو ومواصفات العملاء. إجراء الفحوصات والاختبارات على المنتجات الحديدية النهائية.',
            'requirements_en' => "Diploma or degree in Materials Science or related field\n3+ years in quality control within manufacturing\nFamiliarity with ISO 9001 standards\nAttention to detail\nAbility to read technical drawings",
            'requirements_ar' => "دبلوم أو شهادة في علوم المواد أو مجال ذي صلة\n3+ سنوات في مراقبة الجودة في التصنيع\nإلمام بمعايير ISO 9001\nدقة في التفاصيل\nالقدرة على قراءة الرسومات الفنية",
            'location' => 'Riyadh, Saudi Arabia',
            'employment_type' => 'full-time',
            'status' => 'open',
            'expires_at' => now()->addMonths(3),
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        // --- Career Applications (5) --- skip if already seeded
        if (CareerApplication::where('email', 'ahmed.rashid@example.com')->exists()) {
            goto skip_demo_data;
        }
        $applicants = [
            [
                'career_listing_id' => $listing1->id,
                'name' => 'Ahmed Al-Rashid',
                'email' => 'ahmed.rashid@example.com',
                'phone' => '+966 50 123 4567',
                'job_title' => 'Mechanical Engineer',
                'cv_path' => 'cvs/demo_ahmed_cv.pdf',
                'status' => 'new',
            ],
            [
                'career_listing_id' => $listing1->id,
                'name' => 'Fatima Hassan',
                'email' => 'fatima.h@example.com',
                'phone' => '+966 55 987 6543',
                'job_title' => 'Mechanical Engineer',
                'cv_path' => 'cvs/demo_fatima_cv.pdf',
                'status' => 'reviewed',
                'admin_notes' => 'Strong candidate, 7 years of relevant experience.',
                'reviewed_by' => $adminId,
            ],
            [
                'career_listing_id' => $listing2->id,
                'name' => 'Omar Khalil',
                'email' => 'omar.khalil@example.com',
                'phone' => '+966 54 456 7890',
                'job_title' => 'Quality Control Inspector',
                'cv_path' => 'cvs/demo_omar_cv.pdf',
                'status' => 'shortlisted',
                'admin_notes' => 'ISO 9001 certified. Schedule interview.',
                'reviewed_by' => $adminId,
            ],
            [
                'career_listing_id' => $listing2->id,
                'name' => 'Sara Al-Mutairi',
                'email' => 'sara.m@example.com',
                'phone' => '+966 56 321 0987',
                'job_title' => 'Quality Control Inspector',
                'cv_path' => 'cvs/demo_sara_cv.pdf',
                'status' => 'rejected',
                'admin_notes' => 'Does not meet minimum experience requirement.',
                'reviewed_by' => $adminId,
            ],
            [
                'name' => 'Khalid Ibrahim',
                'email' => 'khalid.i@example.com',
                'phone' => '+966 59 654 3210',
                'job_title' => 'Production Supervisor',
                'cv_path' => 'cvs/demo_khalid_cv.pdf',
                'status' => 'new',
                'career_listing_id' => null,
            ],
        ];

        foreach ($applicants as $i => $data) {
            $app = CareerApplication::create($data);
            // Stagger created_at dates so they appear in a realistic order
            $app->update(['created_at' => now()->subDays(10 - $i * 2)]);
        }

        // --- Contact Submissions (4) ---
        $contacts = [
            [
                'name' => 'Mohammed Al-Zahrani',
                'company' => 'Gulf Construction Co.',
                'email' => 'mohammed.z@gulfconstruction.example.com',
                'phone' => '+966 50 111 2233',
                'country' => 'Saudi Arabia',
                'request_type' => 'quotation',
                'subject' => 'Bulk rebar order for residential project',
                'message' => "We are working on a large residential project in Jeddah and need a quotation for 500 tons of 16mm and 20mm steel rebar.\n\nPlease provide pricing, delivery timeline, and available test certificates.\n\nBest regards,\nMohammed",
                'is_read' => false,
                'is_archived' => false,
            ],
            [
                'name' => 'Laura Chen',
                'company' => 'SteelTrade International',
                'email' => 'l.chen@steeltrade.example.com',
                'phone' => '+971 4 555 6789',
                'country' => 'United Arab Emirates',
                'request_type' => 'partnership',
                'subject' => 'Distribution partnership opportunity',
                'message' => "Dear Nuor Steel team,\n\nWe are a steel trading company based in Dubai and are interested in exploring a distribution partnership for your products in the UAE market.\n\nCould we schedule a call to discuss further?\n\nRegards,\nLaura Chen",
                'is_read' => true,
                'is_archived' => false,
                'read_by' => $adminId,
            ],
            [
                'name' => 'Abdullah Malik',
                'company' => 'Malik Engineering Services',
                'email' => 'a.malik@malikeng.example.com',
                'phone' => '+966 55 444 7788',
                'country' => 'Saudi Arabia',
                'request_type' => 'vendor',
                'subject' => 'Vendor registration request',
                'message' => "Hello,\n\nWe would like to register as an approved vendor for steel supply. Our company specializes in infrastructure projects and we are looking for reliable steel suppliers.\n\nPlease send us the vendor registration requirements.\n\nThank you,\nAbdullah",
                'is_read' => false,
                'is_archived' => false,
            ],
            [
                'name' => 'Nadia Al-Harbi',
                'company' => 'Green Build KSA',
                'email' => 'nadia@greenbuild.example.com',
                'phone' => '+966 53 222 9900',
                'country' => 'Saudi Arabia',
                'request_type' => 'sustainability',
                'subject' => 'EPD certificate inquiry',
                'message' => "Hi,\n\nWe are a green building consultancy and one of our clients requires EPD-certified steel for a LEED project. Could you provide details on your environmental product declarations?\n\nThanks,\nNadia",
                'is_read' => true,
                'is_archived' => true,
                'read_by' => $adminId,
            ],
        ];

        foreach ($contacts as $i => $data) {
            $contact = ContactSubmission::create($data);
            $contact->update(['created_at' => now()->subDays(12 - $i * 3)]);
        }

        // --- Newsletter Subscribers (6) ---
        $subscribers = [
            ['email' => 'buyer@steelworks.example.com', 'source' => 'website'],
            ['email' => 'procurement@buildco.example.com', 'source' => 'website'],
            ['email' => 'info@arabsteel.example.com', 'source' => 'website'],
            ['email' => 'john.doe@contractor.example.com', 'source' => 'website'],
            ['email' => 'supply.chain@megaproject.example.com', 'source' => 'website'],
            ['email' => 'unsubscribed@oldclient.example.com', 'source' => 'website', 'is_active' => false, 'unsubscribed_at' => now()->subDays(5)],
        ];

        foreach ($subscribers as $i => $data) {
            $sub = NewsletterSubscriber::create(array_merge(
                ['is_active' => true],
                $data,
            ));
            $sub->update(['subscribed_at' => now()->subDays(30 - $i * 4)]);
        }

        skip_demo_data:
    }
}

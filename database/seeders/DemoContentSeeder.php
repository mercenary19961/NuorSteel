<?php

namespace Database\Seeders;

use App\Models\CareerApplication;
use App\Models\CareerListing;
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

        // --- Media (4 placeholder images) ---
        $mediaItems = [];
        $colors = [
            ['bg' => [180, 60, 30], 'label' => 'Steel Rebar'],
            ['bg' => [50, 80, 120], 'label' => 'Wire Rod'],
            ['bg' => [80, 100, 80], 'label' => 'Factory'],
            ['bg' => [100, 70, 50], 'label' => 'Production'],
        ];
        $images = [
            ['original_filename' => 'steel-rebar.jpg', 'alt_text_en' => 'Steel rebar bundle', 'alt_text_ar' => 'حزمة حديد تسليح', 'folder' => 'products'],
            ['original_filename' => 'wire-rod-coil.jpg', 'alt_text_en' => 'Wire rod coil', 'alt_text_ar' => 'لفائف أسلاك الحديد', 'folder' => 'products'],
            ['original_filename' => 'factory-exterior.jpg', 'alt_text_en' => 'Nuor Steel factory', 'alt_text_ar' => 'مصنع نور للحديد', 'folder' => 'general'],
            ['original_filename' => 'production-line.jpg', 'alt_text_en' => 'Steel production line', 'alt_text_ar' => 'خط إنتاج الحديد', 'folder' => 'general'],
        ];

        Storage::makeDirectory('media');

        foreach ($images as $i => $img) {
            $filename = Str::random(20) . '.jpg';
            $path = 'media/' . $filename;

            // Generate a real placeholder JPEG using GD
            $width = 800;
            $height = 600;
            $image = imagecreatetruecolor($width, $height);
            $bg = $colors[$i]['bg'];
            $bgColor = imagecolorallocate($image, $bg[0], $bg[1], $bg[2]);
            imagefill($image, 0, 0, $bgColor);

            // Add label text
            $white = imagecolorallocate($image, 255, 255, 255);
            $label = $colors[$i]['label'];
            $fontSize = 5;
            $textWidth = imagefontwidth($fontSize) * strlen($label);
            $textHeight = imagefontheight($fontSize);
            imagestring($image, $fontSize, (int) (($width - $textWidth) / 2), (int) (($height - $textHeight) / 2), $label, $white);

            // Save to a temp file then store via Storage
            $tmpFile = tempnam(sys_get_temp_dir(), 'demo_');
            imagejpeg($image, $tmpFile, 85);
            imagedestroy($image);

            $fileSize = filesize($tmpFile);
            Storage::put($path, file_get_contents($tmpFile));
            unlink($tmpFile);

            $mediaItems[] = Media::create([
                'filename' => $filename,
                'original_filename' => $img['original_filename'],
                'path' => $path,
                'mime_type' => 'image/jpeg',
                'size' => $fileSize,
                'alt_text_en' => $img['alt_text_en'],
                'alt_text_ar' => $img['alt_text_ar'],
                'folder' => $img['folder'],
                'uploaded_by' => $adminId,
            ]);
        }

        // --- Products (2) ---
        Product::create([
            'name_en' => 'Steel Rebar',
            'name_ar' => 'حديد التسليح',
            'slug' => 'steel-rebar',
            'short_description_en' => 'High-strength deformed steel reinforcing bars for concrete construction.',
            'short_description_ar' => 'قضبان حديد تسليح مشوهة عالية المقاومة للبناء الخرساني.',
            'description_en' => 'Our steel rebar is manufactured to meet SASO and international standards. Available in sizes from 8mm to 32mm diameter, suitable for residential, commercial, and infrastructure projects.',
            'description_ar' => 'يتم تصنيع حديد التسليح لدينا وفقًا لمعايير ساسو والمعايير الدولية. متوفر بأقطار من 8 مم إلى 32 مم، مناسب للمشاريع السكنية والتجارية والبنية التحتية.',
            'category' => 'rebar',
            'featured_image_id' => $mediaItems[0]->id,
            'is_active' => true,
            'is_featured' => true,
            'sort_order' => 0,
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        Product::create([
            'name_en' => 'Wire Rod',
            'name_ar' => 'لفائف الأسلاك',
            'slug' => 'wire-rod',
            'short_description_en' => 'Low-carbon wire rod coils for drawing, nails, and mesh production.',
            'short_description_ar' => 'لفائف أسلاك منخفضة الكربون للسحب والمسامير وإنتاج الشبك.',
            'description_en' => 'Premium quality wire rod produced from carefully selected billets. Ideal for downstream wire drawing, nail manufacturing, and welded mesh production. Available in 5.5mm to 12mm diameter.',
            'description_ar' => 'لفائف أسلاك عالية الجودة مصنوعة من كتل مختارة بعناية. مثالية لسحب الأسلاك وتصنيع المسامير وإنتاج الشبك الملحوم. متوفرة بأقطار من 5.5 مم إلى 12 مم.',
            'category' => 'wire rod',
            'featured_image_id' => $mediaItems[1]->id,
            'is_active' => true,
            'is_featured' => false,
            'sort_order' => 1,
            'created_by' => $adminId,
            'updated_by' => $adminId,
        ]);

        // --- Career Listings (2) ---
        $listing1 = CareerListing::create([
            'title_en' => 'Mechanical Engineer',
            'title_ar' => 'مهندس ميكانيكي',
            'slug' => 'mechanical-engineer',
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

        $listing2 = CareerListing::create([
            'title_en' => 'Quality Control Inspector',
            'title_ar' => 'مفتش مراقبة الجودة',
            'slug' => 'quality-control-inspector',
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

        // --- Career Applications (5) ---
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
    }
}

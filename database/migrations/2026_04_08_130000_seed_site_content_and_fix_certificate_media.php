<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // ============================================================
        // 1. Seed site_content (was only in seeder, never ran on prod)
        // ============================================================
        $contents = [
            ['page' => 'home', 'section' => 'about', 'key' => 'title', 'content_en' => 'About Nuor Steel', 'content_ar' => 'عن شركة نور للحديد', 'type' => 'text'],
            ['page' => 'home', 'section' => 'about', 'key' => 'description', 'content_en' => 'Nuor Steel Industry Company is a leading Saudi steel manufacturer founded in 2010 in Al Kharj Industrial City. As a fully integrated producer of steel billets and TMT rebars, it supports national infrastructure and industrial growth aligned with Saudi Vision 2030.', 'content_ar' => 'شركة نور للصناعات الحديدية هي شركة سعودية رائدة في صناعة الحديد تأسست عام 2010 في المدينة الصناعية بالخرج. بصفتها منتجاً متكاملاً لكتل الصلب وحديد التسليح، تدعم البنية التحتية الوطنية والنمو الصناعي بما يتماشى مع رؤية السعودية 2030.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'title', 'content_en' => 'Vision & Mission', 'content_ar' => 'الرؤية والرسالة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'vision_title', 'content_en' => 'Vision', 'content_ar' => 'الرؤية', 'type' => 'text'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'vision_description', 'content_en' => 'To be the leading producer and marketer of high-quality steel products in the Middle East, setting benchmarks for quality, reliability, and sustainability.', 'content_ar' => 'أن نكون المنتج والمسوّق الرائد لمنتجات الحديد عالية الجودة في الشرق الأوسط، ونضع معايير الجودة والموثوقية والاستدامة.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'mission_title', 'content_en' => 'Mission', 'content_ar' => 'الرسالة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'mission_description', 'content_en' => 'To be the most trusted provider of construction materials in Saudi Arabia and the leading TMT bar brand in the Middle East, powered by innovation, uncompromising quality, and continuous improvement.', 'content_ar' => 'أن نكون المزوّد الأكثر ثقة لمواد البناء في المملكة العربية السعودية والعلامة التجارية الرائدة لحديد التسليح في الشرق الأوسط، بدعم من الابتكار والجودة المتميزة والتحسين المستمر.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'vision2030', 'key' => 'paragraph1', 'content_en' => 'Nuor Steel Industry Company supports Saudi Vision 2030 by strengthening local industrial capabilities and advancing the localization of critical construction materials. As a fully integrated steel manufacturer, Nuor Steel is positioned to support giga and mega-projects through reliable supply, consistent quality, and national-scale production.', 'content_ar' => 'تدعم شركة نور للصناعات الحديدية رؤية السعودية 2030 من خلال تعزيز القدرات الصناعية المحلية والنهوض بتوطين مواد البناء الحيوية. بصفتها مصنعاً متكاملاً للحديد، تتمتع نور ستيل بالقدرة على دعم المشاريع العملاقة والكبرى من خلال إمداد موثوق وجودة ثابتة وإنتاج على المستوى الوطني.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'vision2030', 'key' => 'paragraph2', 'content_en' => 'As a proud member of the "Made in Saudi" program, Nuor Steel contributes to local value creation and the growth of a competitive, globally respected Saudi industrial sector.', 'content_ar' => 'بصفتها عضواً فخوراً في برنامج "صنع في السعودية"، تساهم نور ستيل في خلق القيمة المحلية ونمو قطاع صناعي سعودي تنافسي ومحترم عالمياً.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'title', 'content_en' => 'Core Values', 'content_ar' => 'القيم الأساسية', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'quality_title', 'content_en' => 'Quality', 'content_ar' => 'الجودة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'quality_description', 'content_en' => 'We maintain the highest quality standards through strict inspections and continuous improvement, delivering reliable and consistent steel products.', 'content_ar' => 'نحافظ على أعلى معايير الجودة من خلال عمليات التفتيش الصارمة والتحسين المستمر، لتقديم منتجات حديدية موثوقة ومتسقة.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'sustainability_title', 'content_en' => 'Sustainability', 'content_ar' => 'الاستدامة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'sustainability_description', 'content_en' => 'We operate with a strong commitment to environmental responsibility by minimizing emissions, improving energy efficiency, and prioritizing material recycling in line with international best practices.', 'content_ar' => 'نعمل بالتزام قوي تجاه المسؤولية البيئية من خلال تقليل الانبعاثات وتحسين كفاءة الطاقة وإعطاء الأولوية لإعادة تدوير المواد وفقاً لأفضل الممارسات الدولية.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'innovation_title', 'content_en' => 'Innovation', 'content_ar' => 'الابتكار', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'innovation_description', 'content_en' => 'We embrace advanced technologies and digital solutions to optimize our processes and develop efficient, future-ready steel solutions.', 'content_ar' => 'نتبنى التقنيات المتقدمة والحلول الرقمية لتحسين عملياتنا وتطوير حلول حديدية فعالة ومستعدة للمستقبل.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'strategic_growth_title', 'content_en' => 'Strategic Growth', 'content_ar' => 'النمو الاستراتيجي', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'strategic_growth_description', 'content_en' => 'We focus on sustainable, long-term growth by building strong partnerships and aligning our expansion with national and regional development objectives.', 'content_ar' => 'نركز على النمو المستدام طويل الأمد من خلال بناء شراكات قوية ومواءمة توسعنا مع أهداف التنمية الوطنية والإقليمية.', 'type' => 'textarea'],
            ['page' => 'about', 'section' => 'overview', 'key' => 'title', 'content_en' => 'About Us', 'content_ar' => 'من نحن', 'type' => 'text'],
            ['page' => 'about', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Nuor Steel Industry Company is dedicated to manufacturing premium quality steel products while maintaining the highest standards of environmental responsibility and workplace safety.', 'content_ar' => 'شركة نور للصناعات الحديدية مكرسة لتصنيع منتجات الحديد عالية الجودة مع الحفاظ على أعلى معايير المسؤولية البيئية وسلامة مكان العمل.', 'type' => 'textarea'],
            ['page' => 'about', 'section' => 'vision', 'key' => 'title', 'content_en' => 'Our Vision', 'content_ar' => 'رؤيتنا', 'type' => 'text'],
            ['page' => 'about', 'section' => 'vision', 'key' => 'description', 'content_en' => 'To be the leading steel manufacturer in the region, recognized for quality, innovation, and sustainability.', 'content_ar' => 'أن نكون الشركة الرائدة في تصنيع الحديد في المنطقة، معروفين بالجودة والابتكار والاستدامة.', 'type' => 'textarea'],
            ['page' => 'about', 'section' => 'mission', 'key' => 'title', 'content_en' => 'Our Mission', 'content_ar' => 'مهمتنا', 'type' => 'text'],
            ['page' => 'about', 'section' => 'mission', 'key' => 'description', 'content_en' => 'To deliver high-quality steel products that meet international standards while contributing to sustainable development and customer satisfaction.', 'content_ar' => 'تقديم منتجات حديدية عالية الجودة تلبي المعايير الدولية مع المساهمة في التنمية المستدامة ورضا العملاء.', 'type' => 'textarea'],
            ['page' => 'about', 'section' => 'timeline', 'key' => 'title', 'content_en' => 'Our Journey', 'content_ar' => 'رحلتنا', 'type' => 'text'],
            ['page' => 'about', 'section' => 'governance', 'key' => 'title', 'content_en' => 'Governance', 'content_ar' => 'الحوكمة', 'type' => 'text'],
            ['page' => 'about', 'section' => 'governance', 'key' => 'description', 'content_en' => 'Our commitment to ethical business practices and transparent governance.', 'content_ar' => 'التزامنا بممارسات الأعمال الأخلاقية والحوكمة الشفافة.', 'type' => 'text'],
            ['page' => 'products', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Our Products', 'content_ar' => 'منتجاتنا', 'type' => 'text'],
            ['page' => 'products', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Discover our range of high-quality steel products, engineered to meet the most demanding construction and industrial requirements.', 'content_ar' => 'اكتشف مجموعتنا من منتجات الحديد عالية الجودة، المصممة لتلبية أصعب متطلبات البناء والصناعة.', 'type' => 'textarea'],
            ['page' => 'quality', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Quality Assurance', 'content_ar' => 'ضمان الجودة', 'type' => 'text'],
            ['page' => 'quality', 'section' => 'overview', 'key' => 'description', 'content_en' => 'We maintain rigorous quality control standards throughout our production process, ensuring every product meets international specifications.', 'content_ar' => 'نحافظ على معايير صارمة لمراقبة الجودة طوال عملية الإنتاج، مما يضمن أن كل منتج يلبي المواصفات الدولية.', 'type' => 'textarea'],
            ['page' => 'quality', 'section' => 'certifications', 'key' => 'title', 'content_en' => 'Our Certifications', 'content_ar' => 'شهاداتنا', 'type' => 'text'],
            ['page' => 'quality', 'section' => 'certifications', 'key' => 'description', 'content_en' => 'Our quality management system is certified to international standards.', 'content_ar' => 'نظام إدارة الجودة لدينا معتمد وفقًا للمعايير الدولية.', 'type' => 'text'],
            ['page' => 'certificates', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Supplier Approvals & Certificates', 'content_ar' => 'اعتمادات الموردين والشهادات', 'type' => 'text'],
            ['page' => 'certificates', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Our comprehensive certifications demonstrate our commitment to quality, safety, and environmental responsibility.', 'content_ar' => 'تُظهر شهاداتنا الشاملة التزامنا بالجودة والسلامة والمسؤولية البيئية.', 'type' => 'textarea'],
            ['page' => 'certificates', 'section' => 'esg', 'key' => 'title', 'content_en' => 'ESG & Sustainability', 'content_ar' => 'البيئة والمجتمع والحوكمة والاستدامة', 'type' => 'text'],
            ['page' => 'certificates', 'section' => 'esg', 'key' => 'description', 'content_en' => 'Environmental, Social, and Governance certifications.', 'content_ar' => 'شهادات البيئة والمجتمع والحوكمة.', 'type' => 'text'],
            ['page' => 'certificates', 'section' => 'quality', 'key' => 'title', 'content_en' => 'Quality Certifications', 'content_ar' => 'شهادات الجودة', 'type' => 'text'],
            ['page' => 'certificates', 'section' => 'governance', 'key' => 'title', 'content_en' => 'Governance Documents', 'content_ar' => 'وثائق الحوكمة', 'type' => 'text'],
            ['page' => 'career', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Career Opportunities', 'content_ar' => 'فرص العمل', 'type' => 'text'],
            ['page' => 'career', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Join our team and be part of a dynamic organization committed to excellence.', 'content_ar' => 'انضم إلى فريقنا وكن جزءًا من منظمة ديناميكية ملتزمة بالتميز.', 'type' => 'textarea'],
            ['page' => 'career', 'section' => 'open_application', 'key' => 'title', 'content_en' => 'Open Application', 'content_ar' => 'تقديم طلب مفتوح', 'type' => 'text'],
            ['page' => 'career', 'section' => 'open_application', 'key' => 'description', 'content_en' => "Don't see a position that fits? Submit your CV and we'll keep it on file for future opportunities.", 'content_ar' => 'لا ترى وظيفة مناسبة؟ أرسل سيرتك الذاتية وسنحتفظ بها للفرص المستقبلية.', 'type' => 'text'],
            ['page' => 'contact', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Get in Touch', 'content_ar' => 'تواصل معنا', 'type' => 'text'],
            ['page' => 'contact', 'section' => 'overview', 'key' => 'description', 'content_en' => "We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.", 'content_ar' => 'يسعدنا سماع رأيك. يرجى ملء النموذج أدناه وسنرد عليك في أقرب وقت ممكن.', 'type' => 'textarea'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'submit_text', 'content_en' => 'Send Message', 'content_ar' => 'إرسال الرسالة', 'type' => 'text'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'success_message', 'content_en' => 'Thank you for your message. We will get back to you soon.', 'content_ar' => 'شكرًا لرسالتك. سنرد عليك قريبًا.', 'type' => 'text'],
        ];

        $now = now();
        foreach ($contents as $content) {
            DB::table('site_content')->updateOrInsert(
                ['page' => $content['page'], 'section' => $content['section'], 'key' => $content['key']],
                array_merge($content, ['created_at' => $now, 'updated_at' => $now])
            );
        }

        // ============================================================
        // 2. Fix certificate media links (previous migration failed
        //    because Storage::exists() couldn't find the PDFs)
        // ============================================================
        Storage::makeDirectory('media');

        $certificates = DB::table('certificates')->whereNull('file_media_id')->get();

        foreach ($certificates as $cert) {
            if (!$cert->file_path) {
                continue;
            }

            $originalFilename = basename($cert->file_path);

            // Check if media record already exists
            $media = DB::table('media')
                ->where('original_filename', $originalFilename)
                ->where('folder', 'certificates')
                ->whereNull('deleted_at')
                ->first();

            if ($media) {
                DB::table('certificates')
                    ->where('id', $cert->id)
                    ->update(['file_media_id' => $media->id]);
                continue;
            }

            // Try Storage first, then fall back to storage_path() direct file check
            $storagePath = $cert->file_path; // e.g., "certificates/saudi-made-certificate.pdf"
            $absolutePath = storage_path('app/private/' . $storagePath);

            if (!Storage::exists($storagePath) && !file_exists($absolutePath)) {
                continue;
            }

            $fileContents = Storage::exists($storagePath)
                ? Storage::get($storagePath)
                : file_get_contents($absolutePath);

            $fileSize = Storage::exists($storagePath)
                ? Storage::size($storagePath)
                : filesize($absolutePath);

            $newFilename = Str::random(20) . '.pdf';
            $newPath = 'media/' . $newFilename;

            Storage::put($newPath, $fileContents);

            $mediaId = DB::table('media')->insertGetId([
                'filename' => $newFilename,
                'original_filename' => $originalFilename,
                'path' => $newPath,
                'mime_type' => 'application/pdf',
                'size' => $fileSize,
                'alt_text_en' => $cert->title_en,
                'alt_text_ar' => $cert->title_ar,
                'folder' => 'certificates',
                'created_at' => $now,
            ]);

            DB::table('certificates')
                ->where('id', $cert->id)
                ->update(['file_media_id' => $mediaId]);
        }
    }

    public function down(): void
    {
        // No-op: data will remain
    }
};

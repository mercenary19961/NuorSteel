<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            // Home Page - About section
            ['page' => 'home', 'section' => 'about', 'key' => 'title', 'content_en' => 'About Nuor Steel', 'content_ar' => 'عن شركة حديد نور', 'type' => 'text'],
            ['page' => 'home', 'section' => 'about', 'key' => 'description', 'content_en' => 'Nuor Steel Industry Company is a leading Saudi steel manufacturer founded in 2010 in Al Kharj Industrial City. As a fully integrated producer of steel billets and TMT rebars, it supports national infrastructure and industrial growth aligned with Saudi Vision 2030.', 'content_ar' => 'شركة حديد نور للصناعة هي شركة سعودية رائدة في صناعة الحديد تأسست عام 2010 في المدينة الصناعية بالخرج. بصفتها منتجاً متكاملاً لستيل بِليت وحديد التسليح، تدعم البنية التحتية الوطنية والنمو الصناعي بما يتماشى مع رؤية السعودية 2030.', 'type' => 'textarea'],

            // Home Page - Vision & Mission section
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'title', 'content_en' => 'Vision & Mission', 'content_ar' => 'الرؤية والرسالة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'vision_title', 'content_en' => 'Vision', 'content_ar' => 'الرؤية', 'type' => 'text'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'vision_description', 'content_en' => 'To be the leading producer and marketer of high-quality steel products in the Middle East, setting benchmarks for quality, reliability, and sustainability.', 'content_ar' => 'أن نكون الخيار الأول في الشرق الأوسط لإنتاج وتسويق الحديد عالي الجودة، مع ترسيخ أعلى معايير الجودة والموثوقية والاستدامة.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'mission_title', 'content_en' => 'Mission', 'content_ar' => 'الرسالة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'vision_mission', 'key' => 'mission_description', 'content_en' => 'To be the most trusted provider of construction materials in Saudi Arabia and the leading TMT bar brand in the Middle East, powered by innovation, uncompromising quality, and continuous improvement.', 'content_ar' => 'أن نقود قطاع مواد البناء في المملكة، ونرسّخ ريادتنا كأبرز علامة لحديد التسليح في الشرق الأوسط، من خلال الابتكار والجودة والتحسين المستمر.', 'type' => 'textarea'],

            // Home Page - Vision 2030 section
            ['page' => 'home', 'section' => 'vision2030', 'key' => 'paragraph1', 'content_en' => 'Nuor Steel Industry Company supports Saudi Vision 2030 by strengthening local industrial capabilities and advancing the localization of critical construction materials. As a fully integrated steel manufacturer, Nuor Steel is positioned to support giga and mega-projects through reliable supply, consistent quality, and national-scale production.', 'content_ar' => 'تدعم شركة حديد نور للصناعة رؤية السعودية 2030 عبر تعزيز القدرات الصناعية المحلية وتسريع توطين مواد البناء الحيوية. وبصفتها مصنعًا متكاملًا للحديد، تمكّن نور ستيل المشاريع الكبرى من خلال إمداد موثوق، وجودة ثابتة، وإنتاج وطني بمعايير عالية.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'vision2030', 'key' => 'paragraph2', 'content_en' => 'As a proud member of the "Made in Saudi" program, Nuor Steel contributes to local value creation and the growth of a competitive, globally respected Saudi industrial sector.', 'content_ar' => 'كعضو فاعل في برنامج "صنع في السعودية"، تقود شركة حديد نور للصناعة تعزيز القيمة المحلية وترسّخ حضور قطاع صناعي سعودي تنافسي على الساحة العالمية.', 'type' => 'textarea'],

            // Home Page - Core Values section
            ['page' => 'home', 'section' => 'core_values', 'key' => 'title', 'content_en' => 'Core Values', 'content_ar' => 'القيم الأساسية', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'quality_title', 'content_en' => 'Quality', 'content_ar' => 'الجودة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'quality_description', 'content_en' => 'We maintain the highest quality standards through strict inspections and continuous improvement, delivering reliable and consistent steel products.', 'content_ar' => 'نحافظ على أعلى معايير الجودة من خلال عمليات التفتيش الصارمة والتحسين المستمر، لتقديم منتجات حديدية موثوقة ومتسقة.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'sustainability_title', 'content_en' => 'Sustainability', 'content_ar' => 'الاستدامة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'sustainability_description', 'content_en' => 'We operate with a strong commitment to environmental responsibility by minimizing emissions, improving energy efficiency, and prioritizing material recycling in line with international best practices.', 'content_ar' => 'نعمل بالتزام قوي تجاه المسؤولية البيئية من خلال تقليل الانبعاثات وتحسين كفاءة الطاقة وإعطاء الأولوية لإعادة تدوير المواد وفقاً لأفضل الممارسات الدولية.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'innovation_title', 'content_en' => 'Innovation', 'content_ar' => 'الابتكار', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'innovation_description', 'content_en' => 'We embrace advanced technologies and digital solutions to optimize our processes and develop efficient, future-ready steel solutions.', 'content_ar' => 'نتبنى التقنيات المتقدمة والحلول الرقمية لتحسين عملياتنا وتطوير حلول حديدية فعالة ومستعدة للمستقبل.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'strategic_growth_title', 'content_en' => 'Strategic Growth', 'content_ar' => 'النمو الاستراتيجي', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'strategic_growth_description', 'content_en' => 'We focus on sustainable, long-term growth by building strong partnerships and aligning our expansion with national and regional development objectives.', 'content_ar' => 'نركز على النمو المستدام طويل الأمد من خلال بناء شراكات قوية ومواءمة توسعنا مع أهداف التنمية الوطنية والإقليمية.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'people_teamwork_title', 'content_en' => 'People & Teamwork', 'content_ar' => 'الأفراد والعمل الجماعي', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'people_teamwork_description', 'content_en' => 'Empowering our people and fostering a culture of collaboration to achieve shared success. We believe that strong teams, aligned goals, and continuous development are the foundation of sustainable growth.', 'content_ar' => 'تمكين موظفينا وتعزيز ثقافة التعاون لتحقيق النجاح المشترك. نؤمن بأن الفرق القوية والأهداف المتوافقة والتطوير المستمر هي أساس النمو المستدام.', 'type' => 'textarea'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'trust_integrity_title', 'content_en' => 'Trust & Integrity', 'content_ar' => 'الثقة والنزاهة', 'type' => 'text'],
            ['page' => 'home', 'section' => 'core_values', 'key' => 'trust_integrity_description', 'content_en' => 'Building long-term relationships through transparency, accountability, and ethical business practices. We are committed to acting with honesty in every interaction, ensuring reliability and confidence in everything we deliver.', 'content_ar' => 'بناء علاقات طويلة الأمد من خلال الشفافية والمساءلة والممارسات التجارية الأخلاقية. نلتزم بالتصرف بأمانة في كل تعامل، لضمان الموثوقية والثقة في كل ما نقدمه.', 'type' => 'textarea'],

            // About Page
            ['page' => 'about', 'section' => 'overview', 'key' => 'title', 'content_en' => 'About Us', 'content_ar' => 'من نحن', 'type' => 'text'],
            ['page' => 'about', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Nuor Steel Industry Company is dedicated to manufacturing premium quality steel products while maintaining the highest standards of environmental responsibility and workplace safety.', 'content_ar' => 'شركة حديد نور للصناعة هي شركة رائدة في صناعة الحديد في المملكة العربية السعودية، تأسست عام 2010 ويقع مقرها الرئيسي في المدينة الصناعية بالخرج. تأسست في الأصل كشركة تجارة حديد، وتطورت شركة نور للحديد لتصبح منتجاً متكاملاً للحديد بمرافق تصنيع متقدمة متخصصة في إنتاج كتل الحديد عالية الجودة وحديد التسليح.', 'type' => 'textarea'],

            ['page' => 'about', 'section' => 'vision', 'key' => 'title', 'content_en' => 'Our Vision', 'content_ar' => 'رؤيتنا', 'type' => 'text'],
            ['page' => 'about', 'section' => 'vision', 'key' => 'description', 'content_en' => 'To be the leading steel manufacturer in the region, recognized for quality, innovation, and sustainability.', 'content_ar' => 'أن نكون الشركة الرائدة في تصنيع الحديد في المنطقة، معروفين بالجودة والابتكار والاستدامة.', 'type' => 'textarea'],

            ['page' => 'about', 'section' => 'mission', 'key' => 'title', 'content_en' => 'Our Mission', 'content_ar' => 'مهمتنا', 'type' => 'text'],
            ['page' => 'about', 'section' => 'mission', 'key' => 'description', 'content_en' => 'To deliver high-quality steel products that meet international standards while contributing to sustainable development and customer satisfaction.', 'content_ar' => 'تقديم منتجات حديدية عالية الجودة تلبي المعايير الدولية مع المساهمة في التنمية المستدامة ورضا العملاء.', 'type' => 'textarea'],

            ['page' => 'about', 'section' => 'timeline', 'key' => 'title', 'content_en' => 'Our Journey', 'content_ar' => 'رحلتنا', 'type' => 'text'],

            // Products Page
            ['page' => 'products', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Our Products', 'content_ar' => 'منتجاتنا', 'type' => 'text'],
            ['page' => 'products', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Discover our range of high-quality steel products, engineered to meet the most demanding construction and industrial requirements.', 'content_ar' => 'اكتشف مجموعتنا من منتجات الحديد عالية الجودة، المصممة لتلبية أصعب متطلبات البناء والصناعة.', 'type' => 'textarea'],

            // Quality Page
            ['page' => 'quality', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Quality Assurance', 'content_ar' => 'ضمان الجودة', 'type' => 'text'],
            ['page' => 'quality', 'section' => 'overview', 'key' => 'description', 'content_en' => 'We maintain rigorous quality control standards throughout our production process, ensuring every product meets international specifications.', 'content_ar' => 'نحافظ على معايير صارمة لمراقبة الجودة طوال عملية الإنتاج، مما يضمن أن كل منتج يلبي المواصفات الدولية.', 'type' => 'textarea'],

            ['page' => 'quality', 'section' => 'certifications', 'key' => 'title', 'content_en' => 'Our Certifications', 'content_ar' => 'شهاداتنا', 'type' => 'text'],
            ['page' => 'quality', 'section' => 'certifications', 'key' => 'description', 'content_en' => 'Our quality management system is certified to international standards.', 'content_ar' => 'نظام إدارة الجودة لدينا معتمد وفقًا للمعايير الدولية.', 'type' => 'text'],

            // Certificates Page
            ['page' => 'certificates', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Supplier Approvals & Certificates', 'content_ar' => 'اعتمادات الموردين والشهادات', 'type' => 'text'],
            ['page' => 'certificates', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Our comprehensive certifications demonstrate our commitment to quality, safety, and environmental responsibility.', 'content_ar' => 'تُظهر شهاداتنا الشاملة التزامنا بالجودة والسلامة والمسؤولية البيئية.', 'type' => 'textarea'],

            ['page' => 'certificates', 'section' => 'esg', 'key' => 'title', 'content_en' => 'ESG & Sustainability', 'content_ar' => 'البيئة والمجتمع والحوكمة والاستدامة', 'type' => 'text'],
            ['page' => 'certificates', 'section' => 'esg', 'key' => 'description', 'content_en' => 'Environmental, Social, and Governance certifications.', 'content_ar' => 'شهادات البيئة والمجتمع والحوكمة.', 'type' => 'text'],

            ['page' => 'certificates', 'section' => 'quality', 'key' => 'title', 'content_en' => 'Quality Certifications', 'content_ar' => 'شهادات الجودة', 'type' => 'text'],
            ['page' => 'certificates', 'section' => 'governance', 'key' => 'title', 'content_en' => 'Governance Documents', 'content_ar' => 'وثائق الحوكمة', 'type' => 'text'],

            // Career Page
            ['page' => 'career', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Career Opportunities', 'content_ar' => 'فرص العمل', 'type' => 'text'],
            ['page' => 'career', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Join our team and be part of a dynamic organization committed to excellence.', 'content_ar' => 'انضم إلى فريقنا وكن جزءًا من منظمة ديناميكية ملتزمة بالتميز.', 'type' => 'textarea'],

            ['page' => 'career', 'section' => 'open_application', 'key' => 'title', 'content_en' => 'Open Application', 'content_ar' => 'تقديم طلب مفتوح', 'type' => 'text'],
            ['page' => 'career', 'section' => 'open_application', 'key' => 'description', 'content_en' => "Don't see a position that fits? Submit your CV and we'll keep it on file for future opportunities.", 'content_ar' => 'لا ترى وظيفة مناسبة؟ أرسل سيرتك الذاتية وسنحتفظ بها للفرص المستقبلية.', 'type' => 'text'],

            // Contact Page
            ['page' => 'contact', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Get in Touch', 'content_ar' => 'تواصل معنا', 'type' => 'text'],
            ['page' => 'contact', 'section' => 'overview', 'key' => 'description', 'content_en' => "We'd love to hear from you. Please fill out the form below and we'll get back to you as soon as possible.", 'content_ar' => 'يسعدنا سماع رأيك. يرجى ملء النموذج أدناه وسنرد عليك في أقرب وقت ممكن.', 'type' => 'textarea'],

            ['page' => 'contact', 'section' => 'form', 'key' => 'submit_text', 'content_en' => 'Send Message', 'content_ar' => 'إرسال الرسالة', 'type' => 'text'],
            ['page' => 'contact', 'section' => 'form', 'key' => 'success_message', 'content_en' => 'Thank you for your message. We will get back to you soon.', 'content_ar' => 'شكرًا لرسالتك. سنرد عليك قريبًا.', 'type' => 'text'],
        ];

        foreach ($contents as $content) {
            SiteContent::updateOrCreate(
                ['page' => $content['page'], 'section' => $content['section'], 'key' => $content['key']],
                $content
            );
        }

        // Clean up deprecated sections
        DB::table('site_content')
            ->where('page', 'home')
            ->whereIn('section', ['hero', 'products', 'certificates', 'newsletter', 'cta'])
            ->delete();
        DB::table('site_content')->where('page', 'recycling')->delete();
        DB::table('site_content')->where('page', 'about')->where('section', 'governance')->delete();
    }
}

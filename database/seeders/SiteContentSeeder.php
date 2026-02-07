<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            // Home Page
            ['page' => 'home', 'section' => 'hero', 'key' => 'title', 'content_en' => 'Leading Steel Manufacturing Excellence', 'content_ar' => 'التميز الرائد في صناعة الحديد', 'type' => 'text'],
            ['page' => 'home', 'section' => 'hero', 'key' => 'subtitle', 'content_en' => 'Quality steel products for a sustainable future', 'content_ar' => 'منتجات حديدية عالية الجودة لمستقبل مستدام', 'type' => 'text'],
            ['page' => 'home', 'section' => 'hero', 'key' => 'cta_text', 'content_en' => 'Get in Touch', 'content_ar' => 'تواصل معنا', 'type' => 'text'],

            ['page' => 'home', 'section' => 'about', 'key' => 'title', 'content_en' => 'About Nuor Steel', 'content_ar' => 'عن شركة نور للحديد', 'type' => 'text'],
            ['page' => 'home', 'section' => 'about', 'key' => 'description', 'content_en' => 'Nuor Steel Industry Company is a leading manufacturer of high-quality steel products, committed to excellence and sustainability.', 'content_ar' => 'شركة نور للصناعات الحديدية هي شركة رائدة في تصنيع منتجات الحديد عالية الجودة، ملتزمة بالتميز والاستدامة.', 'type' => 'textarea'],

            ['page' => 'home', 'section' => 'products', 'key' => 'title', 'content_en' => 'Our Products', 'content_ar' => 'منتجاتنا', 'type' => 'text'],
            ['page' => 'home', 'section' => 'products', 'key' => 'subtitle', 'content_en' => 'Discover our range of high-quality steel products', 'content_ar' => 'اكتشف مجموعتنا من منتجات الحديد عالية الجودة', 'type' => 'text'],

            ['page' => 'home', 'section' => 'certificates', 'key' => 'title', 'content_en' => 'Supplier Approvals & Certificates', 'content_ar' => 'اعتمادات الموردين والشهادات', 'type' => 'text'],
            ['page' => 'home', 'section' => 'certificates', 'key' => 'subtitle', 'content_en' => 'Our commitment to quality and sustainability', 'content_ar' => 'التزامنا بالجودة والاستدامة', 'type' => 'text'],

            ['page' => 'home', 'section' => 'newsletter', 'key' => 'title', 'content_en' => 'Stay Updated', 'content_ar' => 'ابق على اطلاع', 'type' => 'text'],
            ['page' => 'home', 'section' => 'newsletter', 'key' => 'description', 'content_en' => 'Subscribe to our newsletter for the latest news and updates.', 'content_ar' => 'اشترك في نشرتنا الإخبارية لأحدث الأخبار والتحديثات.', 'type' => 'text'],

            // About Page
            ['page' => 'about', 'section' => 'overview', 'key' => 'title', 'content_en' => 'About Us', 'content_ar' => 'من نحن', 'type' => 'text'],
            ['page' => 'about', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Nuor Steel Industry Company is dedicated to manufacturing premium quality steel products while maintaining the highest standards of environmental responsibility and workplace safety.', 'content_ar' => 'شركة نور للصناعات الحديدية مكرسة لتصنيع منتجات الحديد عالية الجودة مع الحفاظ على أعلى معايير المسؤولية البيئية وسلامة مكان العمل.', 'type' => 'textarea'],

            ['page' => 'about', 'section' => 'vision', 'key' => 'title', 'content_en' => 'Our Vision', 'content_ar' => 'رؤيتنا', 'type' => 'text'],
            ['page' => 'about', 'section' => 'vision', 'key' => 'description', 'content_en' => 'To be the leading steel manufacturer in the region, recognized for quality, innovation, and sustainability.', 'content_ar' => 'أن نكون الشركة الرائدة في تصنيع الحديد في المنطقة، معروفين بالجودة والابتكار والاستدامة.', 'type' => 'textarea'],

            ['page' => 'about', 'section' => 'mission', 'key' => 'title', 'content_en' => 'Our Mission', 'content_ar' => 'مهمتنا', 'type' => 'text'],
            ['page' => 'about', 'section' => 'mission', 'key' => 'description', 'content_en' => 'To deliver high-quality steel products that meet international standards while contributing to sustainable development and customer satisfaction.', 'content_ar' => 'تقديم منتجات حديدية عالية الجودة تلبي المعايير الدولية مع المساهمة في التنمية المستدامة ورضا العملاء.', 'type' => 'textarea'],

            ['page' => 'about', 'section' => 'timeline', 'key' => 'title', 'content_en' => 'Our Journey', 'content_ar' => 'رحلتنا', 'type' => 'text'],

            ['page' => 'about', 'section' => 'governance', 'key' => 'title', 'content_en' => 'Governance', 'content_ar' => 'الحوكمة', 'type' => 'text'],
            ['page' => 'about', 'section' => 'governance', 'key' => 'description', 'content_en' => 'Our commitment to ethical business practices and transparent governance.', 'content_ar' => 'التزامنا بممارسات الأعمال الأخلاقية والحوكمة الشفافة.', 'type' => 'text'],

            // Recycling Page
            ['page' => 'recycling', 'section' => 'overview', 'key' => 'title', 'content_en' => 'Recycling & Process', 'content_ar' => 'إعادة التدوير والعملية', 'type' => 'text'],
            ['page' => 'recycling', 'section' => 'overview', 'key' => 'description', 'content_en' => 'Our state-of-the-art recycling facilities contribute to a sustainable steel production process.', 'content_ar' => 'تساهم مرافق إعادة التدوير الحديثة لدينا في عملية إنتاج حديد مستدامة.', 'type' => 'textarea'],

            ['page' => 'recycling', 'section' => 'process', 'key' => 'title', 'content_en' => 'Our Process', 'content_ar' => 'عمليتنا', 'type' => 'text'],
            ['page' => 'recycling', 'section' => 'process', 'key' => 'description', 'content_en' => 'From scrap collection to finished product, our integrated process ensures maximum efficiency and minimal environmental impact.', 'content_ar' => 'من جمع الخردة إلى المنتج النهائي، تضمن عمليتنا المتكاملة أقصى كفاءة وأقل تأثير بيئي.', 'type' => 'textarea'],

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
    }
}

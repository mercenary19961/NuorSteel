<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $certificates = [
            // --- Governance ---
            [
                'title_en' => 'Saudi Made Certificate',
                'title_ar' => 'شهادة صنع في السعودية',
                'category' => 'governance',
                'description_en' => 'Official Saudi Made certification for Nuor Steel products.',
                'description_ar' => 'شهادة صنع في السعودية الرسمية لمنتجات نور للحديد.',
                'file_path' => 'certificates/saudi-made-certificate.pdf',
                'sort_order' => 1,
            ],
            // --- Quality ---
            [
                'title_en' => 'ISO 9001 Quality Management System',
                'title_ar' => 'نظام إدارة الجودة ISO 9001',
                'category' => 'quality',
                'description_en' => 'ISO 9001:2015 certification for quality management systems.',
                'description_ar' => 'شهادة ISO 9001:2015 لأنظمة إدارة الجودة.',
                'file_path' => 'certificates/iso-9001-certificate.pdf',
                'sort_order' => 1,
            ],
            // --- ESG ---
            [
                'title_en' => 'HPD - Health Product Declaration',
                'title_ar' => 'إعلان المنتج الصحي HPD',
                'category' => 'esg',
                'description_en' => 'Health Product Declaration for Nuor Steel rebar products.',
                'description_ar' => 'إعلان المنتج الصحي لمنتجات حديد التسليح من نور.',
                'file_path' => 'certificates/nuor-steel-rebar-hpd.pdf',
                'sort_order' => 1,
            ],
            [
                'title_en' => 'DUNS Certification',
                'title_ar' => 'شهادة DUNS',
                'category' => 'esg',
                'description_en' => 'Dun & Bradstreet DUNS number certification for Nuor Steel.',
                'description_ar' => 'شهادة رقم DUNS من Dun & Bradstreet لشركة نور للحديد.',
                'file_path' => 'certificates/nuor-steel-duns-certification.pdf',
                'sort_order' => 2,
            ],
            [
                'title_en' => 'NCEC 2026',
                'title_ar' => 'المركز الوطني للرقابة البيئية 2026',
                'category' => 'esg',
                'description_en' => 'National Center for Environmental Compliance certificate.',
                'description_ar' => 'شهادة المركز الوطني للالتزام البيئي.',
                'file_path' => 'certificates/ncec-2026.pdf',
                'sort_order' => 3,
            ],
            [
                'title_en' => 'EPD - Environmental Product Declaration',
                'title_ar' => 'إعلان المنتج البيئي EPD',
                'category' => 'esg',
                'description_en' => 'Environmental Product Declaration (EPD HUB-3476) for Nuor Steel.',
                'description_ar' => 'إعلان المنتج البيئي (EPD HUB-3476) لشركة نور للحديد.',
                'file_path' => 'certificates/epd-hub-3476.pdf',
                'sort_order' => 4,
            ],
            [
                'title_en' => 'ISO 45001 Occupational Health & Safety',
                'title_ar' => 'نظام إدارة السلامة والصحة المهنية ISO 45001',
                'category' => 'esg',
                'description_en' => 'ISO 45001:2018 certification for occupational health and safety management.',
                'description_ar' => 'شهادة ISO 45001:2018 لإدارة السلامة والصحة المهنية.',
                'file_path' => 'certificates/iso-45001-certificate.pdf',
                'sort_order' => 5,
            ],
            [
                'title_en' => 'ISO 14001 Environmental Management System',
                'title_ar' => 'نظام الإدارة البيئية ISO 14001',
                'category' => 'esg',
                'description_en' => 'ISO 14001:2015 certification for environmental management systems.',
                'description_ar' => 'شهادة ISO 14001:2015 لأنظمة الإدارة البيئية.',
                'file_path' => 'certificates/iso-14001-certificate.pdf',
                'sort_order' => 6,
            ],
            [
                'title_en' => 'Aramco Registration Letter',
                'title_ar' => 'خطاب تسجيل أرامكو',
                'category' => 'esg',
                'description_en' => 'Saudi Aramco vendor registration approval letter.',
                'description_ar' => 'خطاب الموافقة على تسجيل مورد أرامكو السعودية.',
                'file_path' => 'certificates/aramco-registration-letter.pdf',
                'sort_order' => 7,
            ],
        ];

        foreach ($certificates as $data) {
            Certificate::updateOrCreate(
                ['file_path' => $data['file_path']],
                array_merge($data, [
                    'is_active' => true,
                    'created_by' => 1,
                    'updated_by' => 1,
                ])
            );
        }
    }
}

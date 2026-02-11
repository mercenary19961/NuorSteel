{{-- Structured Data / JSON-LD Schema Markup --}}
{{-- TODO: Replace all placeholder values with real company details before going live --}}

{{-- Organization Schema --}}
<script type="application/ld+json">
{
    "@@context": "https://schema.org",
    "@@type": "Organization",
    "name": "Nuor Steel Industry Company",
    "alternateName": "شركة نور للصناعات الحديدية",
    "image": "{{ config('app.url') }}/images/og-image.webp",
    "description": "Leading steel industry company specializing in steel manufacturing, recycling, and sustainable production.",
    "address": {
        "@@type": "PostalAddress",
        "streetAddress": "PLACEHOLDER_STREET",
        "addressLocality": "PLACEHOLDER_CITY",
        "addressRegion": "PLACEHOLDER_REGION",
        "postalCode": "PLACEHOLDER_POSTAL",
        "addressCountry": "SA"
    },
    "url": "{{ config('app.url') }}",
    "telephone": "PLACEHOLDER_PHONE",
    "email": "info@nuorsteel.com",
    "sameAs": [
        "PLACEHOLDER_LINKEDIN_URL"
    ],
    "industry": "Steel Manufacturing",
    "numberOfEmployees": {
        "@@type": "QuantitativeValue",
        "value": "PLACEHOLDER_COUNT"
    }
}
</script>

{{-- WebSite Schema --}}
<script type="application/ld+json">
{
    "@@context": "https://schema.org",
    "@@type": "WebSite",
    "name": "Nuor Steel",
    "url": "{{ config('app.url') }}"
}
</script>

{{-- SiteNavigationElement Schema (helps Google generate sitelinks) --}}
<script type="application/ld+json">
{
    "@@context": "https://schema.org",
    "@@type": "ItemList",
    "itemListElement": [
        {
            "@@type": "SiteNavigationElement",
            "position": 1,
            "name": "About Us",
            "url": "{{ config('app.url') }}/about"
        },
        {
            "@@type": "SiteNavigationElement",
            "position": 2,
            "name": "Products",
            "url": "{{ config('app.url') }}/products"
        },
        {
            "@@type": "SiteNavigationElement",
            "position": 3,
            "name": "Quality",
            "url": "{{ config('app.url') }}/quality"
        },
        {
            "@@type": "SiteNavigationElement",
            "position": 4,
            "name": "Career",
            "url": "{{ config('app.url') }}/career"
        },
        {
            "@@type": "SiteNavigationElement",
            "position": 5,
            "name": "Certificates",
            "url": "{{ config('app.url') }}/certificates"
        },
        {
            "@@type": "SiteNavigationElement",
            "position": 6,
            "name": "Contact",
            "url": "{{ config('app.url') }}/contact"
        }
    ]
}
</script>

{{-- FAQ Schema --}}
<script type="application/ld+json">
{
    "@@context": "https://schema.org",
    "@@type": "FAQPage",
    "mainEntity": [
        {
            "@@type": "Question",
            "name": "What does Nuor Steel manufacture?",
            "acceptedAnswer": {
                "@@type": "Answer",
                "text": "Nuor Steel Industry Company specializes in steel manufacturing and recycling, producing high-quality steel products for construction and industrial applications."
            }
        },
        {
            "@@type": "Question",
            "name": "Where is Nuor Steel located?",
            "acceptedAnswer": {
                "@@type": "Answer",
                "text": "Nuor Steel is located in PLACEHOLDER_CITY, Saudi Arabia. Contact us at info@nuorsteel.com for more information."
            }
        },
        {
            "@@type": "Question",
            "name": "Does Nuor Steel have quality certifications?",
            "acceptedAnswer": {
                "@@type": "Answer",
                "text": "Yes, Nuor Steel holds multiple certifications including ISO 9001, ISO 14001, ISO 45001, and various ESG and quality certifications. Visit our Certificates page for the full list."
            }
        },
        {
            "@@type": "Question",
            "name": "How can I contact Nuor Steel?",
            "acceptedAnswer": {
                "@@type": "Answer",
                "text": "You can reach Nuor Steel by email at info@nuorsteel.com or by phone at PLACEHOLDER_PHONE. You can also fill out the contact form on our website."
            }
        }
    ]
}
</script>

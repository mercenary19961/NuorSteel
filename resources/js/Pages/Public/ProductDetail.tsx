import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

interface ProductImage {
  id: number;
  url: string;
  alt: string;
  is_primary: boolean;
}

interface Props {
  product: {
    id: number;
    name: string;
    name_en: string;
    name_ar: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    category: string | null;
    featured_image: string | null;
    images: ProductImage[];
    specifications: {
      chemical: { property: string; value: string }[];
      mechanical: { property: string; value: string }[];
      dimensional: { property: string; value: string }[];
    };
  };
}

export default function ProductDetail({ product }: Props) {
  const { t } = useTranslation();
  const [activeImage, setActiveImage] = useState(0);

  const images = product.images.length > 0
    ? product.images
    : product.featured_image
      ? [{ id: 0, url: product.featured_image, alt: product.name, is_primary: true }]
      : [];

  const hasSpecs = product.specifications.chemical.length > 0
    || product.specifications.mechanical.length > 0
    || product.specifications.dimensional.length > 0;

  return (
    <PublicLayout>
      <Head title={product.name} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/products" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
            <ArrowLeft size={16} className="mr-1" />
            {t('products.backToProducts')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {images.length > 0 ? (
              <>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={images[activeImage]?.url}
                    alt={images[activeImage]?.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImage(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 ${
                          index === activeImage ? 'border-blue-600' : 'border-transparent'
                        }`}
                      >
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">{product.name}</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <span className="inline-block text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
                {product.category}
              </span>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            {product.short_description && (
              <p className="text-lg text-gray-600 mb-6">{product.short_description}</p>
            )}
            {product.description && (
              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              {t('products.requestQuote')}
            </Link>
          </div>
        </div>

        {/* Specifications */}
        {hasSpecs && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('products.specifications')}</h2>
            <div className="space-y-8">
              {product.specifications.chemical.length > 0 && (
                <SpecTable title={t('products.specs.chemical')} specs={product.specifications.chemical} />
              )}
              {product.specifications.mechanical.length > 0 && (
                <SpecTable title={t('products.specs.mechanical')} specs={product.specifications.mechanical} />
              )}
              {product.specifications.dimensional.length > 0 && (
                <SpecTable title={t('products.specs.dimensional')} specs={product.specifications.dimensional} />
              )}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

function SpecTable({ title, specs }: { title: string; specs: { property: string; value: string }[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-b border-gray-200">Property</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-b border-gray-200">Value</th>
            </tr>
          </thead>
          <tbody>
            {specs.map((spec, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="py-3 px-4 text-sm text-gray-900">{spec.property}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

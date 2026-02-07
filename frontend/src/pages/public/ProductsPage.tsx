import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePublicProducts } from '../../hooks/usePublicData';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { data: products, isLoading } = usePublicProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('products.hero.title')}
          </h1>
          <p className="text-xl text-gray-300">
            {t('products.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-100 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">{product.name}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    <Link
                      to={`/products/${product.slug}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {t('products.viewDetails')}
                      <ArrowRight className="ml-2" size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">{t('products.empty')}</p>
          )}
        </div>
      </section>
    </div>
  );
}

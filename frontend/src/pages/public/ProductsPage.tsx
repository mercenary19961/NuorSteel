import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProductsPage() {
  const { t } = useTranslation();

  // Placeholder products - will be loaded from API
  const products = [
    { id: 1, slug: 'steel-rebar', name: 'Steel Rebar', description: 'High-quality reinforcing bars' },
    { id: 2, slug: 'wire-rod', name: 'Wire Rod', description: 'Premium wire rod products' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 lg:py-24">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">{t('products.imagePlaceholder')}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
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
        </div>
      </section>
    </div>
  );
}

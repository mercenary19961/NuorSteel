import { useTranslation } from 'react-i18next';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Shield, Recycle, Award, Linkedin, ExternalLink } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';

interface LinkedinPost {
  id: number;
  content: string;
  image_url: string | null;
  post_url: string;
  posted_at: string;
}

interface Props {
  content: Record<string, Record<string, string>>;
  featured_products: { id: number; name: string; slug: string; short_description: string | null; image: string | null }[];
  linkedin_posts: LinkedinPost[];
}

export default function Home({ content, featured_products, linkedin_posts }: Props) {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <Head title="Home" />

      {/* Hero Section */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              {content?.hero?.title || t('home.hero.title')}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {content?.hero?.subtitle || t('home.hero.subtitle')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark rounded-md font-medium transition-colors"
            >
              {content?.hero?.cta_text || t('home.hero.cta')}
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {content?.about?.title || t('home.about.title')}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {content?.about?.description || t('home.about.description')}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
            >
              {t('home.about.learnMore')}
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
            {content?.features?.title || t('home.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {content?.features?.quality_title || t('home.features.quality.title')}
              </h3>
              <p className="text-gray-600">
                {content?.features?.quality_description || t('home.features.quality.description')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {content?.features?.sustainability_title || t('home.features.sustainability.title')}
              </h3>
              <p className="text-gray-600">
                {content?.features?.sustainability_description || t('home.features.sustainability.description')}
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {content?.features?.certified_title || t('home.features.certified.title')}
              </h3>
              <p className="text-gray-600">
                {content?.features?.certified_description || t('home.features.certified.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {content?.products?.title || t('home.products.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {content?.products?.subtitle || t('home.products.subtitle')}
            </p>
          </div>
          {featured_products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {featured_products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-gray-400 text-sm">{product.name}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    {product.short_description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.short_description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-md font-medium transition-colors"
            >
              {t('home.products.viewAll')}
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* LinkedIn Feed Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-[#0A66C2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Linkedin className="text-white" size={32} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('home.linkedin.title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.linkedin.subtitle')}
            </p>
          </div>

          {linkedin_posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              {linkedin_posts.slice(0, 3).map((post) => (
                <a
                  key={post.id}
                  href={post.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {post.image_url && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-gray-700 text-sm line-clamp-4 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(post.posted_at).toLocaleDateString()}</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center mb-8">
              <p className="text-gray-500 mb-4">{t('home.linkedin.noPosts')}</p>
            </div>
          )}

          <div className="text-center">
            <a
              href="https://www.linkedin.com/company/nuorsteel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-md font-medium transition-colors"
            >
              {t('footer.followLinkedIn')}
              <Linkedin className="ml-2" size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {content?.cta?.title || t('home.cta.title')}
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {content?.cta?.description || t('home.cta.description')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-primary hover:bg-gray-100 rounded-md font-medium transition-colors"
          >
            {content?.cta?.button || t('home.cta.button')}
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

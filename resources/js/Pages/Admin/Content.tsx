import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import BilingualEditor from '@/Components/Admin/BilingualEditor';
import { ChevronDown, ChevronRight, Save, Eye, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import type { SiteContent } from '@/types';

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  about: 'About Us',
  recycling: 'Recycling',
  quality: 'Quality',
  career: 'Career',
  certificates: 'Certificates',
  contact: 'Contact',
};

const PAGE_URLS: Record<string, string> = {
  home: '/',
  about: '/about',
  recycling: '/about/recycling',
  quality: '/quality',
  career: '/career',
  certificates: '/certificates',
  contact: '/contact',
};

interface Props {
  content: Record<string, SiteContent[]>;
}

export default function Content({ content: contentByPage }: Props) {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [editedItems, setEditedItems] = useState<
    Record<number, { content_en: string; content_ar: string }>
  >({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewPage, setPreviewPage] = useState('home');
  const [iframeKey, setIframeKey] = useState(0);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [previewInteractive, setPreviewInteractive] = useState(false);

  // Reset edited items when data changes (after successful save / page reload)
  useEffect(() => {
    setEditedItems({});
    setHasChanges(false);
  }, [contentByPage]);

  const pages = Object.keys(contentByPage);

  const togglePage = (page: string) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) {
        next.delete(page);
      } else {
        next.add(page);
        setPreviewPage(page);
      }
      return next;
    });
  };

  const getItemValue = (item: SiteContent, field: 'content_en' | 'content_ar') => {
    if (editedItems[item.id]) return editedItems[item.id][field];
    return item[field];
  };

  const handleChange = (item: SiteContent, field: 'content_en' | 'content_ar', value: string) => {
    setEditedItems((prev) => ({
      ...prev,
      [item.id]: {
        content_en: prev[item.id]?.content_en ?? item.content_en,
        content_ar: prev[item.id]?.content_ar ?? item.content_ar,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const changedIds = Object.keys(editedItems).map(Number);
    if (changedIds.length === 0) return;

    const contents = changedIds.map((id) => ({
      id,
      content_en: editedItems[id].content_en,
      content_ar: editedItems[id].content_ar,
    }));

    router.put('/admin/content', { contents }, {
      preserveScroll: true,
      onStart: () => setSaving(true),
      onFinish: () => setSaving(false),
      onSuccess: () => {
        setEditedItems({});
        setHasChanges(false);
        setIframeKey((k) => k + 1);
      },
    });
  };

  // Group content items by section within each page
  const groupBySection = (items: SiteContent[]) => {
    const sections: Record<string, SiteContent[]> = {};
    for (const item of items) {
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    }
    return sections;
  };

  const previewUrl = PAGE_URLS[previewPage] || '/';

  return (
    <AdminLayout>
      <Head title="Site Content" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {hasChanges && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">You have unsaved changes.</p>
        </div>
      )}

      <div className="flex gap-6">
        {/* Left: Editor */}
        <div className={`w-full space-y-2 min-w-0 transition-all duration-300 ${previewExpanded ? 'xl:w-[30%]' : 'xl:w-[55%]'}`}>
          {pages.map((page) => {
            const isExpanded = expandedPages.has(page);
            const items = contentByPage[page];
            const sections = groupBySection(items);

            return (
              <div key={page} className="bg-white rounded-xl border border-gray-200">
                <button
                  onClick={() => togglePage(page)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <h2 className="text-lg font-semibold text-gray-900">
                      {PAGE_LABELS[page] || page}
                    </h2>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {items.length} items
                    </span>
                  </div>
                  {previewPage === page && (
                    <span className="hidden xl:flex items-center gap-1 text-xs text-primary">
                      <Eye size={14} />
                      Preview
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 space-y-6">
                    {Object.entries(sections).map(([section, sectionItems]) => (
                      <div key={section}>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                          {section}
                        </h3>
                        <div className="space-y-4">
                          {sectionItems.map((item) => (
                            <BilingualEditor
                              key={item.id}
                              label={`${item.key} (${item.type})`}
                              valueEn={getItemValue(item, 'content_en')}
                              valueAr={getItemValue(item, 'content_ar')}
                              onChangeEn={(v) => handleChange(item, 'content_en', v)}
                              onChangeAr={(v) => handleChange(item, 'content_ar', v)}
                              type={item.type}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Live Preview */}
        <div className={`hidden xl:block transition-all duration-300 ${previewExpanded ? 'xl:w-[70%]' : 'xl:w-[45%]'}`}>
          <div className="sticky top-24">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
              {/* Preview header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {PAGE_LABELS[previewPage] || previewPage}
                  </span>
                  <span className="text-xs text-gray-400">{previewUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewExpanded((v) => !v)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title={previewExpanded ? 'Collapse preview' : 'Expand preview'}
                  >
                    {previewExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              {/* Iframe with scroll-trap overlay */}
              <div
                className="relative"
                style={{ height: 'calc(100% - 3rem)' }}
                onMouseLeave={() => setPreviewInteractive(false)}
              >
                {!previewInteractive && (
                  <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={() => setPreviewInteractive(true)}
                  />
                )}
                <iframe
                  key={iframeKey}
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title={`Preview: ${PAGE_LABELS[previewPage] || previewPage}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

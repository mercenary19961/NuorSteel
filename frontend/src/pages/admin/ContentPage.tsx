import { useState, useEffect } from 'react';
import { useContent, useBulkUpdateContent } from '../../hooks/useContent';
import { useToast } from '../../contexts/ToastContext';
import BilingualEditor from '../../components/admin/BilingualEditor';
import { ChevronDown, ChevronRight, Save } from 'lucide-react';
import type { SiteContent } from '../../types';

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  about: 'About Us',
  recycling: 'Recycling',
  quality: 'Quality',
  career: 'Career',
  certificates: 'Certificates',
  contact: 'Contact',
};

export default function ContentPage() {
  const { data: contentByPage, isLoading, error } = useContent();
  const bulkUpdate = useBulkUpdateContent();
  const { success, error: showError } = useToast();

  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [editedItems, setEditedItems] = useState<
    Record<number, { content_en: string; content_ar: string }>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  // Reset edited items when data loads
  useEffect(() => {
    setEditedItems({});
    setHasChanges(false);
  }, [contentByPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !contentByPage) {
    return (
      <div className="text-center py-24">
        <p className="text-red-600">Failed to load site content.</p>
      </div>
    );
  }

  const pages = Object.keys(contentByPage);

  const togglePage = (page: string) => {
    setExpandedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
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

  const handleSave = async () => {
    const changedIds = Object.keys(editedItems).map(Number);
    if (changedIds.length === 0) return;

    const contents = changedIds.map((id) => ({
      id,
      content_en: editedItems[id].content_en,
      content_ar: editedItems[id].content_ar,
    }));

    try {
      await bulkUpdate.mutateAsync(contents);
      success('Content saved successfully.');
      setEditedItems({});
      setHasChanges(false);
    } catch {
      showError('Failed to save content.');
    }
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
        <button
          onClick={handleSave}
          disabled={!hasChanges || bulkUpdate.isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {bulkUpdate.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {hasChanges && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">You have unsaved changes.</p>
        </div>
      )}

      <div className="space-y-2">
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
                            label={`${item.key} (${item.content_type})`}
                            valueEn={getItemValue(item, 'content_en')}
                            valueAr={getItemValue(item, 'content_ar')}
                            onChangeEn={(v) => handleChange(item, 'content_en', v)}
                            onChangeAr={(v) => handleChange(item, 'content_ar', v)}
                            type={item.content_type}
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
    </div>
  );
}

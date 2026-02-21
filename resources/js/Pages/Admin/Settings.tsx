import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Settings as SettingsIcon, X, Plus, Info, Phone, Mail, MapPin, Linkedin, Inbox, Briefcase, type LucideIcon } from 'lucide-react';
import UndoButton from '@/Components/Admin/UndoButton';
import type { Setting, UndoMeta } from '@/types';

interface Props {
  settings: Record<string, Setting[]>;
  undoMeta: UndoMeta | null;
}

function isLongText(value: string | null): boolean {
  return !!value && value.length > 100;
}

function EmailTagInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const emails = value
    ? value.split(',').map((e) => e.trim()).filter(Boolean)
    : [];

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addEmail = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!isValidEmail(trimmed)) {
      setError('Invalid email address');
      return;
    }
    if (emails.includes(trimmed)) {
      setError('Email already added');
      return;
    }

    setError('');
    setInputValue('');
    onChange([...emails, trimmed].join(','));
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(emails.filter((e) => e !== emailToRemove).join(','));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {emails.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
          >
            {email}
            <button
              type="button"
              onClick={() => removeEmail(email)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Add email address..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
        />
        <button
          type="button"
          onClick={addEmail}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function Settings({ settings, undoMeta }: Props) {
  const [editedValues, setEditedValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    Object.values(settings).flat().forEach((setting) => {
      values[setting.key] = setting.value ?? '';
    });
    return values;
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const payload = Object.entries(editedValues).map(([key, value]) => ({ key, value }));
    router.put('/admin/settings', { settings: payload }, {
      preserveScroll: true,
      onStart: () => setSaving(true),
      onFinish: () => setSaving(false),
      onSuccess: () => setHasChanges(false),
    });
  };

  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatGroupLabel = (group: string) => {
    return group
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const isEmailSetting = (group: string) => group === 'email';

  const settingIcons: Record<string, LucideIcon> = {
    company_phone: Phone,
    company_email: Mail,
    company_address_en: MapPin,
    company_address_ar: MapPin,
    linkedin_url: Linkedin,
    contact_recipients: Inbox,
    career_recipients: Briefcase,
  };

  if (Object.keys(settings).length === 0) {
    return (
      <AdminLayout>
        <Head title="Settings" />
        <div className="text-center py-12">
          <SettingsIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No settings configured</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head title="Settings" />
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage site configuration</p>
          </div>
          <div className="flex items-center gap-3">
            <UndoButton modelType="settings" modelId="all" undoMeta={undoMeta} />
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(settings).map(([group, groupSettings]) => (
            <div key={group} className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{formatGroupLabel(group)}</h2>
              </div>
              {group === 'contact' && (
                <div className="mx-6 mt-4 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>These values appear on the website footer, contact page, and search engine metadata. Changes may take time to reflect in search results.</span>
                </div>
              )}
              <div className="p-6 space-y-4">
                {groupSettings.map((setting) => {
                  const Icon = settingIcons[setting.key];
                  return (
                  <div key={setting.key}>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
                      {Icon && <Icon size={14} className="text-gray-400" />}
                      {formatLabel(setting.key)}
                    </label>
                    {isEmailSetting(group) ? (
                      <EmailTagInput
                        value={editedValues[setting.key] ?? ''}
                        onChange={(val) => handleChange(setting.key, val)}
                      />
                    ) : isLongText(setting.value) ? (
                      <textarea
                        value={editedValues[setting.key] ?? ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editedValues[setting.key] ?? ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

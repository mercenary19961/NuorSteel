import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Settings as SettingsIcon, X, Plus, Info, Phone, Mail, MapPin, Linkedin, Facebook, Instagram, Inbox, Briefcase, Map, ExternalLink, AlertTriangle, Lock, Pencil, type LucideIcon } from 'lucide-react';
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
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (!removeTarget) setConfirmText('');
  }, [removeTarget]);

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

  const confirmRemove = () => {
    if (!removeTarget) return;
    onChange(emails.filter((e) => e !== removeTarget).join(','));
    setRemoveTarget(null);
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
              onClick={() => setRemoveTarget(email)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              title="Remove"
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

      {removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRemoveTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Remove recipient</h3>
                <p className="mt-1 text-sm text-gray-600">
                  <strong className="font-mono">{removeTarget}</strong> will no longer receive
                  notifications for this form.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
              <p>
                <strong>This is reversible.</strong> The change doesn't take effect until you click
                <strong> Save Changes</strong>. After saving, the Undo button at the top of the page
                restores the previous list, and every change is permanently recorded in the{' '}
                <a href="/admin/change-log" className="underline font-medium">
                  Change Log
                </a>
                .
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Type <span className="font-mono text-red-600">delete</span> to confirm
              </label>
              <input
                type="text"
                autoFocus
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500"
                placeholder="delete"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setRemoveTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemove}
                disabled={confirmText.trim().toLowerCase() !== 'delete'}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove recipient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Settings({ settings, undoMeta }: Props) {
  const buildSnapshot = (): Record<string, string> => {
    const values: Record<string, string> = {};
    Object.values(settings).flat().forEach((setting) => {
      values[setting.key] = setting.value ?? '';
    });
    return values;
  };

  const [originalValues, setOriginalValues] = useState<Record<string, string>>(buildSnapshot);
  const [editedValues, setEditedValues] = useState<Record<string, string>>(buildSnapshot);
  const [saving, setSaving] = useState(false);

  const isDirty = (key: string) => (editedValues[key] ?? '') !== (originalValues[key] ?? '');
  const hasChanges = Object.keys(editedValues).some(isDirty);
  const dirtyCount = Object.keys(editedValues).filter(isDirty).length;

  const handleChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const payload = Object.entries(editedValues).map(([key, value]) => ({ key, value }));
    router.put('/admin/settings', { settings: payload }, {
      preserveScroll: true,
      onStart: () => setSaving(true),
      onFinish: () => setSaving(false),
      onSuccess: () => setOriginalValues({ ...editedValues }),
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
    facebook_url: Facebook,
    instagram_url: Instagram,
    contact_recipients: Inbox,
    career_recipients: Briefcase,
    google_maps_embed_url: Map,
    google_maps_place_url: ExternalLink,
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
            {hasChanges && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {dirtyCount} unsaved {dirtyCount === 1 ? 'change' : 'changes'}
              </span>
            )}
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
              {group === 'email' && (
                <div className="mx-6 mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <Lock size={14} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>Admin-only.</strong> Only administrators can view or modify these
                    recipients. Removing a recipient requires a typed confirmation; changes are
                    fully reversible via the Undo button or the Change Log after saving.
                  </span>
                </div>
              )}
              <div className="p-6 space-y-4">
                {groupSettings.map((setting) => {
                  const Icon = settingIcons[setting.key];
                  const dirty = isDirty(setting.key);
                  const fieldClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 text-sm ${
                    dirty
                      ? 'border-amber-400 bg-amber-50/40 focus:ring-amber-200 focus:border-amber-500'
                      : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
                  }`;
                  return (
                  <div key={setting.key}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        {Icon && <Icon size={14} className="text-gray-400" />}
                        {formatLabel(setting.key)}
                        {dirty && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-100 text-amber-800 border border-amber-200"
                            title="This field has unsaved changes"
                          >
                            <Pencil size={10} />
                            Modified
                          </span>
                        )}
                      </label>
                      {dirty && !isEmailSetting(group) && (
                        <button
                          type="button"
                          onClick={() => handleChange(setting.key, originalValues[setting.key] ?? '')}
                          className="text-[11px] font-medium text-amber-700 hover:text-amber-900 underline"
                          title={`Revert to "${originalValues[setting.key] ?? ''}"`}
                        >
                          Revert
                        </button>
                      )}
                    </div>
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
                        className={fieldClass}
                      />
                    ) : (
                      <input
                        type="text"
                        value={editedValues[setting.key] ?? ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className={fieldClass}
                      />
                    )}
                    {dirty && !isEmailSetting(group) && (
                      <p className="mt-1 text-[11px] text-amber-700 truncate">
                        Was: <span className="font-mono">{originalValues[setting.key] || '(empty)'}</span>
                      </p>
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

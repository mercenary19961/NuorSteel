import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Settings as SettingsIcon } from 'lucide-react';
import UndoButton from '@/Components/Admin/UndoButton';
import type { Setting, UndoMeta } from '@/types';

interface Props {
  settings: Record<string, Setting[]>;
  undoMeta: UndoMeta | null;
}

function isLongText(value: string | null): boolean {
  return !!value && value.length > 100;
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

        <div className="space-y-6">
          {Object.entries(settings).map(([group, groupSettings]) => (
            <div key={group} className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{formatGroupLabel(group)}</h2>
              </div>
              <div className="p-6 space-y-4">
                {groupSettings.map((setting) => (
                  <div key={setting.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formatLabel(setting.key)}
                    </label>
                    {isLongText(setting.value) ? (
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

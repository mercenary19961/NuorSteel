import { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';
import { useToast } from '../../contexts/ToastContext';
import type { Setting } from '../../types';

export default function SettingsPage() {
  const { success, error: toastError } = useToast();
  const { data: settingsData, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();

  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Sync settings into editable state
  useEffect(() => {
    if (settingsData) {
      const values: Record<string, string> = {};
      Object.values(settingsData).flat().forEach((setting: Setting) => {
        values[setting.key] = setting.value ?? '';
      });
      setEditedValues(values);
      setHasChanges(false);
    }
  }, [settingsData]);

  const handleChange = (key: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const settings = Object.entries(editedValues).map(([key, value]) => ({ key, value }));
    try {
      await updateSettings.mutateAsync(settings);
      success('Settings saved successfully');
      setHasChanges(false);
    } catch {
      toastError('Failed to save settings');
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  if (!settingsData || Object.keys(settingsData).length === 0) {
    return (
      <div className="text-center py-12">
        <Settings size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No settings configured</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage site configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || updateSettings.isPending}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Save size={16} />
          {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(settingsData).map(([group, settings]) => (
          <div key={group} className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{formatGroupLabel(group)}</h2>
            </div>
            <div className="p-6 space-y-4">
              {(settings as Setting[]).map((setting) => (
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
  );
}

function isLongText(value: string | null): boolean {
  return !!value && value.length > 100;
}

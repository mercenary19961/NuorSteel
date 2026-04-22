interface BilingualEditorProps {
  label: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
  type?: 'text' | 'textarea' | 'html';
  rows?: number;
  required?: boolean;
  placeholderEn?: string;
  placeholderAr?: string;
  /** When provided, renders a Default/Override badge next to each language label. */
  isDefaultEn?: boolean;
  isDefaultAr?: boolean;
}

function SourceBadge({ isDefault }: { isDefault: boolean }) {
  if (isDefault) {
    return (
      <span
        title="No value saved. The public site falls back to the translation file default for this field."
        className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-gray-100 text-gray-500 border border-gray-200"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Default
      </span>
    );
  }
  return (
    <span
      title="Custom value saved here. This overrides the translation file default on the public site."
      className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary border border-primary/20"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      Override
    </span>
  );
}

export default function BilingualEditor({
  label,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  type = 'text',
  rows = 4,
  required = false,
  placeholderEn,
  placeholderAr,
  isDefaultEn,
  isDefaultAr,
}: BilingualEditorProps) {
  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary';

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English (LTR) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="block text-xs text-gray-500">English</span>
            {isDefaultEn !== undefined && <SourceBadge isDefault={isDefaultEn} />}
          </div>
          {type === 'textarea' || type === 'html' ? (
            <textarea
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              rows={rows}
              dir="ltr"
              className={inputClass}
              required={required}
              placeholder={placeholderEn}
            />
          ) : (
            <input
              type="text"
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              dir="ltr"
              className={inputClass}
              required={required}
              placeholder={placeholderEn}
            />
          )}
        </div>

        {/* Arabic (RTL) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            {isDefaultAr !== undefined && <SourceBadge isDefault={isDefaultAr} />}
            <span className="block text-xs text-gray-500 text-right">{'\u0627\u0644\u0639\u0631\u0628\u064A\u0629'}</span>
          </div>
          {type === 'textarea' || type === 'html' ? (
            <textarea
              value={valueAr}
              onChange={(e) => onChangeAr(e.target.value)}
              rows={rows}
              dir="rtl"
              className={inputClass}
              required={required}
              placeholder={placeholderAr}
            />
          ) : (
            <input
              type="text"
              value={valueAr}
              onChange={(e) => onChangeAr(e.target.value)}
              dir="rtl"
              className={inputClass}
              required={required}
              placeholder={placeholderAr}
            />
          )}
        </div>
      </div>
    </div>
  );
}

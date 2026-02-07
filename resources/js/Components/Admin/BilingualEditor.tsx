interface BilingualEditorProps {
  label: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
  type?: 'text' | 'textarea' | 'html';
  rows?: number;
  required?: boolean;
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
          <span className="block text-xs text-gray-500 mb-1">English</span>
          {type === 'textarea' || type === 'html' ? (
            <textarea
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              rows={rows}
              dir="ltr"
              className={inputClass}
              required={required}
            />
          ) : (
            <input
              type="text"
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              dir="ltr"
              className={inputClass}
              required={required}
            />
          )}
        </div>

        {/* Arabic (RTL) */}
        <div>
          <span className="block text-xs text-gray-500 mb-1">{'\u0627\u0644\u0639\u0631\u0628\u064A\u0629'}</span>
          {type === 'textarea' || type === 'html' ? (
            <textarea
              value={valueAr}
              onChange={(e) => onChangeAr(e.target.value)}
              rows={rows}
              dir="rtl"
              className={inputClass}
              required={required}
            />
          ) : (
            <input
              type="text"
              value={valueAr}
              onChange={(e) => onChangeAr(e.target.value)}
              dir="rtl"
              className={inputClass}
              required={required}
            />
          )}
        </div>
      </div>
    </div>
  );
}

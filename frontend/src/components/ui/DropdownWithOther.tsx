import { useState, useEffect } from 'react';
import { useDropdownOptions } from '../../hooks/useDropdownOptions';
import { saveCustomOption } from '../../services/dropdownApi';

// Converts "SELF_OWNED" → "Self Owned", "NA" → "N/A"
const formatLabel = (value: string): string => {
  if (value === 'NA') return 'N/A';
  if (value === 'OTHER') return 'Other (Custom)';
  return value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

interface Props {
  fieldName: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DropdownWithOther = ({
  fieldName,
  value,
  onChange,
  placeholder = 'Select option',
  className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
  disabled,
}: Props) => {
  const { options, loading } = useDropdownOptions(fieldName);

  // A value is "custom" if it exists, isn't "OTHER", and isn't in the loaded options
  const isCustomValue =
    !!value && value !== '' && value !== 'OTHER' && !options.includes(value);

  const selectValue = isCustomValue ? 'OTHER' : value ?? '';

  const [customText, setCustomText] = useState<string>(isCustomValue ? value! : '');
  const [saving, setSaving] = useState(false);

  // Sync customText if an existing custom value is loaded on edit
  useEffect(() => {
    if (isCustomValue) setCustomText(value!);
  }, [value, options]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === 'OTHER') {
      setCustomText('');
      onChange('OTHER'); // temp value until user types
    } else {
      setCustomText('');
      onChange(selected);
    }
  };

  const handleCustomBlur = async () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await saveCustomOption(fieldName, trimmed);
    } catch {
      // Silent — still set value so form isn't blocked
    } finally {
      setSaving(false);
    }
    onChange(trimmed); // store custom text as the actual field value
  };

  const showCustomInput = selectValue === 'OTHER';

  return (
    <div className="space-y-2">
      <select
        value={selectValue}
        onChange={handleSelectChange}
        disabled={disabled || loading}
        className={className}
      >
        <option value="">{loading ? 'Loading...' : placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {formatLabel(opt)}
          </option>
        ))}
      </select>

      {showCustomInput && (
        <div className="relative">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onBlur={handleCustomBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Type your custom value and press Enter or click away to save..."
            className={`${className} border-blue-400 bg-blue-50 pr-24`}
            autoFocus
          />
          {saving && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500">
              Saving...
            </span>
          )}
          {!saving && customText.trim() && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              Click away to save
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownWithOther;
// components/operations/report-create/AddSectionDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Table2, Type, LayoutGrid, Image as ImageIcon, ArrowRight } from 'lucide-react';

interface AddSectionDropdownProps {
  onAddData: (type: 'table' | 'custom-table' | 'narrative') => void;
  onAddImage: () => void;
}

const DATA_TYPES = [
  { type: 'table' as const,        label: 'Parameter Table',       icon: Table2,     desc: 'Key-value rows' },
  { type: 'custom-table' as const, label: 'Custom Table',          icon: LayoutGrid, desc: 'Custom columns & rows' },
  { type: 'narrative' as const,    label: 'Narrative Text',        icon: Type,       desc: 'Free-form text block' },
];

const AddSectionDropdown = ({ onAddData, onAddImage }: AddSectionDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'root' | 'data'>('root');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setStep('root');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    setStep('root');
  };

  const handleSelectData = (type: 'table' | 'custom-table' | 'narrative') => {
    onAddData(type);
    setOpen(false);
    setStep('root');
  };

  const handleSelectImage = () => {
    onAddImage();
    setOpen(false);
    setStep('root');
  };

  return (
    <div className="relative inline-block" ref={ref}>

      {/* ── Trigger Button ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
      >
        <Plus className="w-4 h-4" />
        Add Section
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Dropdown Panel ─────────────────────────────────────────────── */}
      {open && (
        <div className="absolute bottom-full mb-2 right-0 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">

          {/* ── ROOT STEP: 2 main options ─────────────────────────────── */}
          {step === 'root' && (
            <div className="p-2 space-y-1">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 pt-1 pb-1">
                What do you want to add?
              </p>

              {/* Option A — Add Data */}
              <button
                type="button"
                onClick={() => setStep('data')}
                className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Table2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">Add Data</p>
                    <p className="text-xs text-gray-400">Table or narrative content</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100 my-1" />

              {/* Option B — Upload Image */}
              <button
                type="button"
                onClick={handleSelectImage}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <ImageIcon className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">Upload Image</p>
                  <p className="text-xs text-gray-400">Add image with caption & heading</p>
                </div>
              </button>
            </div>
          )}

          {/* ── DATA STEP: pick table/narrative type ──────────────────── */}
          {step === 'data' && (
            <div className="p-2 space-y-1">
              {/* Back button */}
              <button
                type="button"
                onClick={() => setStep('root')}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2 pt-1 pb-1 transition-colors"
              >
                <ChevronDown className="w-3 h-3 rotate-90" />
                Back
              </button>

              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 pb-1">
                Choose data type
              </p>

              {DATA_TYPES.map(({ type, label, icon: Icon, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectData(type)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AddSectionDropdown;
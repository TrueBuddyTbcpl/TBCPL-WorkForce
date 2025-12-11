import { Plus } from 'lucide-react';

interface AddFieldButtonProps {
  onClick: () => void;
  label: string;
}

export function AddFieldButton({ onClick, label }: AddFieldButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

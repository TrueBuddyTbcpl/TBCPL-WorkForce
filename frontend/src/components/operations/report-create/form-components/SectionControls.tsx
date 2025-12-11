import { Trash2, MoveUp, MoveDown } from 'lucide-react';

interface SectionControlsProps {
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function SectionControls({
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: SectionControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {canMoveUp && onMoveUp && (
        <button
          type="button"
          onClick={onMoveUp}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Move Up"
        >
          <MoveUp className="w-4 h-4" />
        </button>
      )}
      
      {canMoveDown && onMoveDown && (
        <button
          type="button"
          onClick={onMoveDown}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Move Down"
        >
          <MoveDown className="w-4 h-4" />
        </button>
      )}
      
      <button
        type="button"
        onClick={onDelete}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Section"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
